const domFuncs = require('./dom')
const reports = require('./helpers/reports')
const request = require('request')

class AppDirector {
    constructor(args, handler) {
        this.handler = handler
        this.domItems = {}
        this.inputVals = {}

        this.pageURLs = args.urls
        this.pages = []
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
        
        this.currentPage = 0
        this.getOld(true)
    }
    set current(val) {
        this.currentPage = val
        this.showCurrent()
    }
    get current() { return this.pages[this.currentPage] }

    // ---

    getComponents(id) { return this.domItems[id]}

    getOld(startup) {
        let returnPage = window.localStorage.getItem('returnPage')
        if (Number.isInteger(returnPage)) 
            this.currentPage = returnPage

        let oldVals = window.localStorage.getItem('oldApp')
        if (oldVals) {
            this.oldVals = JSON.parse(oldVals)
            if (this.oldVals.PAGE) {
                this.current = this.oldVals.PAGE
                return
            }
        }

        if (startup) this.showCurrent()
    }

    getOldVal(id) {
        return this.oldVals instanceof Object 
            ? this.oldVals[id] : undefined
    }

    getVal(from) {
        from = typeof from == "string" 
            ? this.getComponents(from).input : from
        
        return !from ? undefined : (
            from.dataset.hasOwnProperty('trueVal') ? JSON.parse(from.dataset.trueVal) : (
                from.nodeName === 'SELECT' ? 
                    from.childNodes[from.selectedIndex].value
                    : from.value
            )
        )
    }

    

    // ---

    getPageSrc(pageNum, cb) {
        let pageRq = {
            headers: { 
                "Content-Type": "application/json" 
            },
            url: window.location.origin + "/data/p" +
                (this.currentPage + 1)  + ".json",
            json: true
        }
        let pageCb = (err, response, body) => {
            if (body && body.forEach) {
                // console.log(response, body)
                this.pages[pageNum] = body

                if (cb) cb()
            }
        }
        // console.log(pageRq.url)
        this.pages[pageNum] = false
        request.get(pageRq, pageCb)
    }

    makePage(pageNum, cb) {
        
        let pageCount = this.pages.length
        let targetPage = pageNum
        while (pageCount < ++targetPage) {
            this.pages.push(undefined)
        }
        console.log(pageNum, this.pages)
        this.pages[pageNum] = domFuncs.page(
            this.pages[pageNum].pop().pageName,
            this.pages[pageNum], this)

        cb()
    }

    import(components, args) {
        this.domItems[args.name] = components
        this.insert(args.name, undefined, true)
        this.handler.import(args)
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
        console.log()
        if (this.current === undefined)
            this.getPageSrc(this.currentPage, () => this.showCurrent())
        else if (Array.isArray(this.current))
            this.makePage(this.currentPage, () => this.showCurrent())
        else {
            // show only the appropriate buttons
            if (this.currentPage === 0) {
                this.buttons.prev.classList.add('softHide')
                this.buttons.done.classList.add('softHide')
            }
            else {
                this.buttons.prev.classList.remove('softHide')

                if (this.currentPage === this.pages.length - 1) {
                    this.buttons.next.classList.add('softHide')
                    this.buttons.done.classList.remove('softHide')
                }
                else {
                    this.buttons.done.classList.add('softHide')
                    this.buttons.next.classList.remove('softHide')
                }
            }

            this.container.innerHTML = ''
            this.container.appendChild(this.current)
        }
        return
    }

    // ---

    insert(id, value, noUpdate) {
        let items = this.getComponents(id)

        if (value || typeof value == "string") {
            let i = 0
            if (items.input.nodeName == "SELECT") {
                if (typeof value == "string") {
                    let cc = items.input.childElementCount
                    while (i < cc) {
                        if (items.input.childElementCount[i].value == value) {
                            value = i
                            break
                        }
                        ++i
                    }
                }
                items.input.selectedIndex = insertIndex
            }
            else items.iput.value = value
        }

        items.inputWrap.replaceChild(items.input, items.input)

        items.input.addEventListener('input', 
            () => this.update(id))

        if (!noUpdate) this.update(id)
    }

    error(id, extra) {
        this.getComponents(id).itemWrap.classList.add('errored-item')
    }
    approve(id) {
        this.getComponents(id).itemWrap.classList.remove('errored-item')
    }

    // ---

    save() {
        this.inputVals['PAGE'] = this.currentPage
        window.localStorage.setItem('oldApp', JSON.stringify(this.inputVals))
    }
    update(id, input, noSave) {
        let val = this.getVal(input ? input : id),
            valid = this.handler.validate(id, val, noSave)
        console.log(id, val, noSave) 

        this.approve(id)
        if (!valid && val.length > 0){
            this.error(id)
            return
        }
        else {
            this.inputVals[id] = val

            if (!noSave) this.save()
            return true
        }
    }
    done() {
        let id, components

        Object.keys(this.domItems).forEach(ik => {
            components = this.getComponents(ik)
            id = components.input.id
            console.log(id, components)
            this.update(id,
                components.input2 ? components.input2 : components.input, 'saveAfter')
        })

        this.save()
        let needed = this.handler.needed
        this.report = needed[0] 
            ? reports.default(this, needed) : reports.success(this, needed)

        document.body.appendChild(this.report.underlay)
    }
}
module.exports.default = AppDirector
