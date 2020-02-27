const Reports = require('./reports').default,
transactions = require('../transactions'),
domFuncs = require('./helpers/dom'),
request = require('request')

class AppDirector {
    constructor(args, handler) {
        this.reports = new Reports(this, args.reports)
        this.handler = handler

        this.inputVals = {}
        this.domItems = {}
        this.pages = []
        this.current

        this.saveTo = args.saveTo
        this.oldVals = args.oldVals
        this.readOnly = args.readOnly

        this.pageUrls = args.pageUrls
        this.pageUrls.forEach(
            p => this.pages.push(undefined) )
        this.totalPages = this.pageUrls.length

        this.container = document.getElementById(args.container)
        if (args.buttons) {
            this.buttons = args.buttons

            if (this.buttons.prev)
                this.buttons.prev.addEventListener('click', 
                    e => this.prevPage() )
            if (this.buttons.next)
                this.buttons.next.addEventListener('click', 
                    e => this.nextPage() )

            this.buttons.done.addEventListener('click', 
                e => this.done() )
        }

        if (this.totalPages > 1) {
            let args = window.location.hash,
            manualPageSet = window.location.hash

            this.hashNavigation()
            this.changeHash(0)

            if (manualPageSet) this.current = 0
        }
        else this.current = 0
    }

    set current(val) {
        val = Number.isNaN(val) ? 0 : Math.floor(val)

        this.currentPage = val
        this.showCurrent()
    }
    get current() { return this.pages[this.currentPage] }

    // get readOnly() { return this.fromApi && this.fromApi != -1 }
    // ---
    buttonDisplayChange(which, visible) {
        if (!this.buttons) return

        let target = this.buttons[which]
        if (!target) return

        let action = visible ?
            button => button.classList.remove('hidden')
            : button => button.classList.add('hidden')
        
        action(target)
        return true
    }
    
    // ---

    getComponents(id) { return id  ? this.domItems[id] : undefined}
    setComponents(id, newComps) { this.domItems[id] = newComps }

    getInputVal(id) {
        let srcItems = this.getComponents(id)
        if (!srcItems) return

        return !srcItems ? undefined : (
            srcItems.input instanceof HTMLSelectElement && srcItems.selectedIndex >= 0 
            && srcItems.input.childNodes[srcItems.input.selectedIndex]
            ? srcItems.input.childNodes[srcItems.input.selectedIndex].value 
            : ( srcItems.input instanceof HTMLInputElement 
                && srcItems.input.type == "checkbox" 
                ?  srcItems.input.checked : srcItems.input.value )
        ) 
    }

    // ---

    getOldVal(out, type) {
        if (!this.oldVals instanceof Object) 
            return

        let val = o => this.oldVals && this.oldVals[o] ? this.oldVals[o] : undefined

        if (!Array.isArray(out)) return val(out)
        // Maybe this could be done better
        let vals = []
        out.forEach(
            o => vals.push(val(o)) )

        return vals.length > 1 
            ? vals.join(type == "date" ? "-" : " " )
            : vals[0] ? vals[0] : undefined

    }

    getPageSrc(pageNum, cb) {
        let pageRq = {
            headers: { 
                "Content-Type": "application/json" 
            },
            url: window.location.origin + this.pageUrls[pageNum] + ".json",
            json: true
        },
        pageCb = (err, response, body) => {
            if (body && body.forEach) {
                this.pages[pageNum] = body

                if (cb) cb()
            }
        }

        this.pages[pageNum] = false
        request.get(pageRq, pageCb)
    }

    makePage(pageNum, cb) {
        let pageCount = this.pages.length
        let targetPage = pageNum
        
        while (pageCount < ++targetPage) 
            { this.pages.push(undefined) }

        this.pages[pageNum] = domFuncs.page(
            this.pages[pageNum].pop().pageName,
            this.pages[pageNum], this)

        cb()
    }

    // ---
    hashNavigation(remove) {
        let hashChange = e => {
            let urlLen = e.newURL.length,
            newPage = e.newURL.substr(urlLen-3, 1)

            this.currentPage = +(newPage-1)
            this.showCurrent()
        }
    
        window.addEventListener('hashchange', hashChange)
    }
    changeHash(page) {
        window.location.hash = "p"+(page + 1).toString()+"/"+this.pages.length
    }
    nextPage() {
        if (this.currentPage === this.pages.length)
            return
        this.changeHash(++this.currentPage)
        this.save()
    }
    prevPage() {
        if (this.currentPage === 0)
            return
        this.changeHash(--this.currentPage)
        this.save()
    }
    showCurrent() {
        let pagesLength = this.pages.length

        if (this.current === undefined)
            this.getPageSrc(this.currentPage, () => this.showCurrent())
        else if (Array.isArray(this.current))
            this.makePage(this.currentPage, () => this.showCurrent())
        else {
            // show only the appropriate buttons
            if (this.currentPage === 0) {
                this.buttonDisplayChange('prev', false)
                this.buttonDisplayChange('done', pagesLength == 1)
            }
            else {
                this.buttonDisplayChange('prev', true)

                if (this.currentPage === pagesLength - 1) {
                    this.buttonDisplayChange('next', false)

                    if (!this.fromApi && this.appState != 7)
                        this.buttonDisplayChange('done', true)
                }
                else {
                    this.buttonDisplayChange('done', false)
                    this.buttonDisplayChange('next', true)
                }
            }
            if (this.container.lastChild)
                this.container.replaceChild(this.current, this.container.lastChild)
            else
                this.container.appendChild(this.current)
            // .firstChild.focus()

            let focusInto = this.current.querySelector('.input-wrap')
            focusInto = focusInto.firstChild instanceof HTMLInputElement || focusInto.firstChild instanceof HTMLSelectElement
                || focusInto.firstChild instanceof HTMLTextAreaElement ? focusInto.firstChild : focusInto.lastChild
            focusInto.focus()

            return true
        }
        return
    }

    // ---

    import(components, args) {
        this.setComponents(args.name, components)
        this.handler.import(args)

        let out = args.out && this.fromApi 
            ? args.out : args.name,
        oldVal = this.getOldVal(out, components.input.type),
        insertVal = Array.isArray(oldVal) && oldVal[0] ? oldVal[oldVal.length -  1] : oldVal

        if (insertVal && !Array.isArray(insertVal)) {
            if (components.specialHandlers) {
                Object.keys(components.specialHandlers).forEach(sh =>
                    components = components.specialHandlers[sh].importHook(components, oldVal) 
                )
            }
            components = this.insert(components, insertVal, true)
        }

        components.inputWrap.addEventListener(
            'change', e => this.update(args.name) )      
        this.setComponents(args.name, components)
        this.update(args.name)  
    }

    insert(id, val, noUpdate) {
        val = val !== undefined ? val : ""            
        let items = typeof id == "string" ? this.getComponents(id) : id
        
        if ( this.fromApi && 
            (id == "github" || id == "linkedin" || id == "devpost") ) 
            val = (re.match(/[\w\-\_]+\/?$/))[0]

        if (items.input.nodeName == "SELECT") {
            let cc = items.input.childElementCount,
                potVals = items.input.childNodes,
                otherIndex,
                i = 0

            while (i < cc) {
                if (potVals[i].value == "Other")
                    otherIndex = i
                if (potVals[i].value == val) {
                    val = i
                    break
                }
                ++i
            }
            items.input.selectedIndex = Number.isInteger(val) ? val :
                (val && Number.isInteger(otherIndex)) ? otherIndex : 0
        }
        else if (items.input.type == "checkbox")
            items.input.checked = Boolean(val)
        else items.input.value = val

        items.inputWrap.replaceChild(items.input, items.input)
        if (!noUpdate && typeof id != "string") this.update(id)
        return items
    }

    approve(id) {
        this.getComponents(id).itemWrap.classList.remove('errored-item')
    }
    error(id, extra) {
        this.getComponents(id).itemWrap.classList.add('errored-item')
    }

    // ---'underlay': underlay,

    save() {
        if (this.readOnly) return

        this.inputVals['PAGE'] = this.currentPage
        transactions.encrypt(this.inputVals, this.saveTo)
    }

    async getFileEncoding(id) {
        let components  = this.getComponents(id)

        if (!components.input.files[0]) return

        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
        return await toBase64(components.input.files[0])
    }
    async update(id, noSave) {
        let components  = this.getComponents(id)
        if (components.specialHandlers) 
            Object.keys(components.specialHandlers).forEach(h => {
                let handler = components.specialHandlers[h]
                if (!handler.noHook) 
                    components = handler.eventHook(components)
            })
        this.setComponents(id, components)
        
        if (this.readOnly) {
            components.inputWrap.classList.add('post-submission')
            return true
        }
        else {
            let val = components.trueVal ? components.trueVal :
                components.input.type == "file" ? await this.getFileEncoding(id)
                : this.getInputVal(id)
            val = components.input.type == "number" ? Number(val) : val
            let valid = components.noValidate ? true : this.handler.validate(id, val, noSave)
            
            if (components.input.type == "file") return
            if (!valid && val.length > 0)
                this.error(id)
            else {
                this.inputVals[id] = val
                this.approve(id)
                if (!noSave) this.save()
            }
            return Boolean(valid)
        }
    }
    
    done(startCheckAt) {
        if (startCheckAt === "confirmed") {
            this.handler.submit(this)
            return
        }

        for (let i = Number.isInteger(startCheckAt) ? startCheckAt : 0; 
            i < this.pages.length; i++) {
            if (!this.pages[i]) {
                this.getPageSrc(i,
                    () => this.makePage(i, () => this.done(++i)) )
                return
            }
        }
        Object.keys(this.domItems).forEach(ik => this.update(ik))

        let needed = this.handler.needed
        if (needed[0])
            this.reports.userErrored(needed)

        else if (this.reports.needsConfirmation)
            this.reports.confirmForm()

        else this.handler.submit(this)
    }

    postSubmission() {
        let items, 
        header = document.createElement('aside')

        Object.keys(this.domItems).forEach(ik => {
            items = this.getComponents(ik)
            items.input.readOnly = true

            this.setComponents(ik, items)
            this.update(ik)
        })

        header.appendChild(document.createElement('p'))
        header.className = "submitted-message-wrap"
        header.firstChild.className = "submitted-message"
        header.firstChild.innerHTML = '\
            Thanks! If you feel there is a meaningful error, \
            <a href="mailto:hello@spartahack.com" target="_blank"> \
            email us (hello@spartahack.com)</a> so we can resolve it!</p>\
        '        
        this.container.prepend(header)

        this.buttonDisplayChange('done', false)
        Object.keys(this.domItems).forEach(dk => {
            this.domItems[dk].input.readOnly = true
            this.update(dk, true)
        })
        window.localStorage.setItem((this.saveTo + "Done"), true)

    }
}
module.exports.default = AppDirector
