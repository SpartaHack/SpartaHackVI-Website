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
    setComponents(id, newComps) { 
        console.log("@set", id, newComps)
        this.domItems[id] = newComps 
    }

    getInputVal(id) {
        let srcItems = this.getComponents(id)

        return !srcItems ? undefined : (
            srcItems.input instanceof HTMLSelectElement
            ? srcItems.input.childNodes[srcItems.input.selectedIndex].value
                : srcItems.input.value
        ) 
    }

    // ---

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
        console.log("makePage")
        let pageCount = this.pages.length
        let targetPage = pageNum
        
        while (pageCount < ++targetPage) 
            { this.pages.push(undefined) }

        this.pages[pageNum] = domFuncs.page(
            this.pages[pageNum].pop().pageName,
            this.pages[pageNum], this)

        console.log(this.domItems)
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
        console.log("@import", args, components)
        this.setComponents(args.name, components)
        this.handler.import(args)

        this.getComponents(args.name).inputWrap.addEventListener(
            'change', e => this.update(args.name) )
        
        // let curVal = this.getInputVal(args.name)
        // if (curVal && !this.handler.validate(args.name, curVal))
        //     this.error(args.name)
    }

    insert(id, value, noUpdate) {
        value = value !== undefined ? value : ""            
        let items = this.getComponents(id)
        // console.log(value)
        console.log(value)
        if (items.input.nodeName == "SELECT") {
            if (value && typeof value == "string") {
                console.log(value)
                let cc = items.input.childElementCount,
                    potVals = items.input.childNodes,
                    i = 0
                    
                while (i < cc) { if (potVals[i].value == value) {
                        value = i
                        break
                    }
                    ++i
                }
            }
            value = Number.isInteger(value) ? value : 0
            items.input.selectedIndex = value
        }
        else items.input.value = value
        
        items.inputWrap.replaceChild(items.input, items.input)
        if (!noUpdate) this.update(id)
    }

    approve(id) {
        this.getComponents(id).itemWrap.classList.remove('errored-item')
    }
    error(id, extra) {
        // console.log(thisdone.getComponents)
        this.getComponents(id).itemWrap.classList.add('errored-item')
    }

    // ---

    save() {
        this.inputVals['PAGE'] = this.currentPage
        window.localStorage.setItem('oldApp', JSON.stringify(this.inputVals))
    }
    update(id, noSave) {
        let components  = this.getComponents(id)
        // console.log("before", components)
        if (components.specialHandlers) 
            Object.keys(components.specialHandlers).forEach(h => {
                let handler = components.specialHandlers[h]
                if (!handler.noHook) 
                    components = handler.eventHook(components)
            })
        this.setComponents(id, components)
        
        // console.log("after", components)
        let val = components.trueVal ? components.trueVal : this.getInputVal(id),
            valid = components.noValidate ? true : this.handler.validate(id, val, noSave)
        // console.log(val)
        this.approve(id)
        if (!valid && val.length > 0)
            this.error(id)

        else {
            this.inputVals[id] = val
            // console.log(components, id)
            if (!noSave) this.save()
        }
        return Boolean(valid)
    }
    done(startCheckAt) {
        console.log("orig pages", this.pages)
        let id, components

        for (let i = Number.isInteger(startCheckAt) ? startCheckAt : 0; 
            i < this.pages.length; i++) {
            console.log(i)
            if (!this.pages[i]) {
                this.getPageSrc(i, () => this.makePage(i, () => this.done(++i)))
                return
            }
        }
        // console.log(this.domItems)

        Object.keys(this.domItems).forEach(ik => {
            components = this.getComponents(ik)
            // console.log(id, components)
            id = components.input.id

            this.update(id, 'saveAfter')
        })
        let needed = this.handler.needed

        if (needed[0])
            this.report = reports.default(this, needed)
        else {
            this.report = reports.success(this, needed)
            this.handler.submit()
        }
        document.body.appendChild(this.report.underlay)
    }
}
module.exports.default = AppDirector
