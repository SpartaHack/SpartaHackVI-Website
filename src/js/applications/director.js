const specials = require('./helpers/_autoComplete')
const domFuncs = require('./dom')
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

    get current() { return this.pages[this.currentPage] }

    // ---

    getOld(startup) {
        let returnPage = window.localStorage.getItem('returnPage')
        if (Number.isInteger(returnPage)) 
            this.currentPage = returnPage

        let oldVals = window.localStorage.getItem('oldApp')
        if (oldVals) {
            this.oldVals = JSON.parse(oldVals)
            console.log(this.oldVals)
        }

        if (startup) this.setPage()
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
        this.pages[pageNum] = domFuncs.page(
            this.pages[pageNum].pop().pageName,
            this.pages[pageNum], this)

        cb()
    }

    import(components, args) {
        this.domItems[args.name] = components
        this.handler.import(args)

        components.input.addEventListener('change', 
            () => this.update(args.name))
    }

    // ---

    nextPage() {
        if (this.currentPage === this.pages.length) return

        ++this.currentPage
        this.setPage()
    }

    prevPage() {
        if (this.currentPage === 0) return

        --this.currentPage
        this.setPage()
    }

    setPage() {
        if (this.current === undefined)
            this.getPageSrc(this.currentPage, () => this.setPage())
        else if (Array.isArray(this.current))
            this.makePage(this.currentPage, () => this.setPage())
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

    save() {
        window.localStorage.setItem('oldApp', JSON.stringify(this.inputVals))
    }
    update(id, input, noSave) {
        input = input ? input : this.domItems[id].input
        let val = input.nodeName === 'SELECT' ? 
            input.childNodes[input.selectedIndex].value
            : input.value
        
        let valid = this.handler.validate(id, val)
        if (!valid){
            this.domItems[id].itemWrap.classList.add('errored-item')
            return
        }
        else {
            this.domItems[id].itemWrap.classList.remove('errored-item')
            this.inputVals[id] = val

            if (!noSave) this.save()
            return true
        }
    }
    done() {
        let id
        Object.keys(this.domItems).forEach(ik => {
            id = this.domItems[ik].input.id

            this.update(id,
                components.input2 ? components.input2 : components.input, 'saveAfter')
        })

        this.save()
        let needed = this.handler.needed
        let report = needed[0] 
            ? reports.default(this, needed) : reports.success(this, needed)

        document.body.appendChild(report)
    }
}
module.exports.default = AppDirector
