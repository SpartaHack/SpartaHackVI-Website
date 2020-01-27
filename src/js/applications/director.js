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

    getComponents(id) { return id  ? this.domItems[id] : undefined}
    setComponents(id, newComps) { this.domItems[id] = newComps }

    getInputVal(id) {
        let srcItems = this.getComponents(id)

        return !srcItems ? undefined : (
            srcItems.input instanceof HTMLSelectElement
            ? srcItems.input.childNodes[srcItems.input.selectedIndex].value
            : ( srcItems.input instanceof HTMLInputElement 
                && srcItems.input.type == "checkbox" 
                ?  srcItems.input.checked : srcItems.input.value )
        ) 
    }

    // ---

    getOld(startup) {
        let oldVals = window.localStorage.getItem('oldApp')
        if (oldVals) {
            this.oldVals = JSON.parse(oldVals)
            // if (this.oldVals.PAGE) {
            //     this.current = this.oldVals.PAGE
            //     return
            // }
        }

        if (startup) this.showCurrent()
    }

    getOldVal(id) {
        return this.oldVals instanceof Object 
            ? this.oldVals[id] : undefined
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

            this.container.innerHTML = ''
            this.container.appendChild(this.current)
            return true
        }
        return
    }

    // ---

    import(components, args) {
        this.setComponents(args.name, components)
        this.handler.import(args)

        let oldVal = this.getOldVal(args.name),
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
        
        if (items.input.nodeName == "SELECT") {
            if (typeof val == "string") {
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
            }
            items.input.selectedIndex = Number.isInteger(val) ? val : 0
        }
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

    isApplied() {

    }
}
module.exports.default = AppDirector
