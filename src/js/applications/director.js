const specials = require('./helpers/_autoComplete')
const domFuncs = require('./dom')
const request = require('request')

class AppDirector {
    constructor(args, handler) {
        this.handler = handler
        this.domItems = {}

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
        // this.setPage()
    }

    get current() { return this.pages[this.currentPage] }

    // population
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
            this.pages[pageNum], this.handler )

        cb()
    }

    importItem(args) {
        
    }

    // interaction

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

    done() {
        
    }

    

    error(id) {
        let target = errored.placeholder == 'profile-url' 
            ? errored.parentNode : errored
        if (off) target.classList.remove('errored')
        else target.classList.add('errored')
    }

    report() {

    }
 
    /*
    report(needed) {
        console.log(needed, "testing")
        if (needed && !Array.isArray(needed)) return

        let exitWrap = document.createElement('div')
        exitWrap.id = 'report-incomplete-bg'

        let reportWrap = document.createElement('aside')
        reportWrap.id = 'report-incomplete'

        reportWrap.appendChild(document.createElement('h3'))
        reportWrap.lastChild.id = 'report-title'
        
        let checks
        if (needed && needed.length) {
            reportWrap.appendChild(document.createElement('p'))
            reportWrap.lastChild.id = 'report-summary'
            
            reportWrap.firstChild.innerHTML = 'Application Incomplete'
            reportWrap.lastChild.innerHTML = 'The following fields need to be changed or completed'
    
            reportWrap.appendChild(document.createElement('ul'))
            reportWrap.lastChild.id = 'needed-fields'
    
            needed.forEach(nf => {
                reportWrap.lastChild.appendChild(document.createElement('li'))
                reportWrap.lastChild.lastChild.innerHTML = this.fields[nf].error
            })
        }
        else {
            reportWrap.firstChild.innerHTML = 'Before we continue'
            checks = []

            let getCheck = (body, sId) => {
                let wrap = document.createElement('p')
                wrap.className = "consentor"
                wrap.id = sId + 'Wrap'

                wrap.appendChild(document.createElement('input'))
                wrap.lastChild.type = "checkbox"
                wrap.lastChild.id = sId
                checks.push(wrap.lastChild)

                wrap.appendChild(document.createElement('span'))
                wrap.lastChild.innerHTML = body

                return wrap
            }
            
            let b1 = 'I authorize you to share certain application/registration information for event administration, ranking, MLH administration, pre and post-event informational e-mails, and occasional messages about hackathons in-line with the MLH Privacy Policy. I further I agree to the terms of both the MLH Contest Terms and Conditions and the MLH Privacy Policy.'
            let b2 = 'I have read and agree to the MLH Code of Conduct.'
            
            reportWrap.appendChild(getCheck(b1, 'privacy'))
            reportWrap.appendChild(getCheck(b2, 'conduct'))
        }

        reportWrap.appendChild(document.createElement('div'))
        
        let exitButton = document.createElement('button')
        exitButton.id="exit-button"
        exitButton.innerHTML = "Exit"
        reportWrap.lastChild.appendChild(exitButton)    

        let completeButton = document.createElement('button')
        completeButton.innerHTML = "Complete"
        completeButton.id="complete-button"

        
        if (Array.isArray(checks)) {
            checks.forEach(c => c.addEventListener('change', () => {
                let total = checks.length
                let checked = 0

                checks.forEach(c => {if (c.checked) ++checked}) 
                
                if (total == checked) 
                reportWrap.lastChild.appendChild(completeButton)
                else if (reportWrap.lastChild.lastChild == completeButton)
                reportWrap.lastChild.removeChild(completeButton)
            }) )
        }
        
        let removeModal = () => document.body.removeChild(exitWrap)
        exitButton.addEventListener('click', removeModal)
        
        completeButton.addEventListener('click', () => sendApp(
            this.application, JSON.parse(localStorage.getItem('stutoken')) ) )

        exitWrap.appendChild(reportWrap)
        return exitWrap  
    }

    update(src) {
        let fieldItems = this.import(src)
        if (!fieldItems) return undefined;
        console.log(fieldItems)
        let func = fieldItems['validator']
        let worked = func(src, this.out)

        this.fields[src.id].needed = this.fields[src.id].needed ? 
            !(Boolean(worked)) : this.fields[src.id].needed

        if (worked === true) {
            if (this.new && localStorage.hasOwnProperty('application')) {
                let oldApp = JSON.parse(localStorage.getItem('application'))

                if (this.out['name'] == oldApp['name']){
                    let current = Object.assign(oldApp, this.out)
                    this.out = current
                    this.new = false
                }
            }
            localStorage.setItem('application', JSON.stringify(this.out))
            this.domError(src, true)
        }
        else if (worked === "selectSwap") this.selectSwap(fieldItems)
        
        else this.error(src, worked)
        
        console.log(this.out)
        return worked
    }
    */
    dummy() {}
}

module.exports.default = AppDirector
