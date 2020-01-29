const domFuncs = require('./dom'),
reports = require('./helpers/reports'),
request = require('request')

class AppDirector {
    constructor(args, handler, old, fromApi) {
        this.handler = handler
        this.domItems = {}
        this.inputVals = {}

        this.pages = []
        this.oldVals = old
        this.pageURLs = args.urls
        this.pageURLs.forEach(
            p => this.pages.push(undefined) )
        
        this.container = document.getElementById(args.container)
        this.buttons = args.buttons ? args.buttons : {
            'prev': document.getElementById("previous-page-button"),
            'next': document.getElementById("next-page-button"),
            'done': document.getElementById("done-button")
        }
        
        this.buttons.prev.addEventListener('click', 
            e => this.prevPage() )
        this.buttons.next.addEventListener('click', 
            e => this.nextPage() )
        this.buttons.done.addEventListener('click', 
            e => this.done() )
            
        this.fromApi = fromApi
        this.currentPage = 0
        this.showCurrent()
        if (this.fromApi) this.postSubmission()
    }

    set current(val) {
        this.currentPage = val
        this.showCurrent()
    }
    get current() { return this.pages[this.currentPage] }

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

        let val = o => this.oldVals[o] ? this.oldVals[o] : undefined

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
            url: window.location.origin + "/data/p" +
                (pageNum + 1)  + ".json",
            json: true
        }
        let pageCb = (err, response, body) => {
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

    nextPage() {
        if (this.currentPage === this.pages.length) return
        ++this.currentPage
        this.showCurrent()
        this.save()
    }
    prevPage() {
        if (this.currentPage === 0) return
        --this.currentPage
        this.showCurrent()
        this.save()
    }
    showCurrent() {
        if (this.current === undefined)
            this.getPageSrc(this.currentPage, () => this.showCurrent())
        else if (Array.isArray(this.current))
            this.makePage(this.currentPage, () => this.showCurrent())
        else {
            // show only the appropriate buttons
            if (this.currentPage === 0) {
                this.buttons.prev.classList.add('hidden')
                this.buttons.done.classList.add('hidden')
            }
            else {
                this.buttons.prev.classList.remove('hidden')

                if (this.currentPage === this.pages.length - 1) {
                    this.buttons.next.classList.add('hidden')
                    this.buttons.done.classList.remove('hidden')
                }
                else {
                    this.buttons.done.classList.add('hidden')
                    this.buttons.next.classList.remove('hidden')
                }
            }

            this.container.replaceChild(this.current, this.container.lastChild)
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

        // console.log(args.name, oldVal, this.domItems)
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
        
        if (items.input.nodeName == "SELECT") {
            let cc = items.input.childElementCount,
                potVals = items.input.childNodes,
                i = 0
            while (i < cc) { 
                if (potVals[i].value == "other") {
                    otherIndex = i
                }
                if (potVals[i].value == val) {
                    val = i
                    break
                }
                ++i
            }

            items.input.selectedIndex = Number.isInteger(val) ? val : 0
        }
        else items.input.value = val
        // console.log(id, val, items)
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
        this.inputVals['PAGE'] = this.currentPage
        window.localStorage.setItem('oldApp', JSON.stringify(this.inputVals))
    }
    update(id, noSave) {
        let components  = this.getComponents(id)
        if (components.specialHandlers) 
            Object.keys(components.specialHandlers).forEach(h => {
                let handler = components.specialHandlers[h]
                if (!handler.noHook) 
                    components = handler.eventHook(components)
            })
        this.setComponents(id, components)
        
        let val = components.trueVal ? components.trueVal : this.getInputVal(id)
        val = components.input.type == "number" ? Number(val) : val
        let valid = components.noValidate ? true : this.handler.validate(id, val, noSave)
            // console.log(val, valid)
        this.approve(id)
        if (!valid && val.length > 0)
            this.error(id)

        else {
            this.inputVals[id] = val
            if (!noSave) this.save()
        }
        return Boolean(valid)
    }
    
    done(startCheckAt) {
        let id, components

        for (let i = Number.isInteger(startCheckAt) ? startCheckAt : 0; 
            i < this.pages.length; i++) {
            if (!this.pages[i]) {
                this.getPageSrc(i, () => this.makePage(i, () => this.done(++i)))
                return
            }
        }

        Object.keys(this.domItems).forEach(ik => this.update(ik))
        let needed = this.handler.needed
        this.report = needed[0] 
            ? reports.default(this, needed) : reports.success(this, needed)

        document.body.appendChild(this.report.container)
        document.body.appendChild(this.report.underlay)
    }

    postSubmission() {
        let items
        Object.keys(this.domItems).forEach(ik => {
            items = this.getComponents(ik)
            items.input.readOnly = true

            this.setComponents(ik, items)
            this.update(ik)
        })

        let header = document.createElement('aside')
        header.appendChild(document.createElement('p'))
        header.className = "submitted-message-wrap"
        header.firstChild.className = "submitted-message"
        header.firstChild.innerHTML = '\
            Thanks for submitting your appliction! If you made a meaningful error \
            while completing the form,<a href="mailto:hello@spartahack.com" target="_blank"> \
            email us (hello@spartahack.com)</a> so we can resolve it!</p>\
            '
        
        console.log(this.container)
        this.container.prepend(header)
    }
}
module.exports.default = AppDirector
