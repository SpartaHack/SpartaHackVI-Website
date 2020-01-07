const specials = require('./helpers/special')

class AppDirector {
    constructor(AppHandler, pageURLs, existing) {
        this.handler = AppHandler

        let numPages = pageURLs.length
        this.existing = typeof existing == "array" 
            && existing.length == numPages
            && typeof existing[0] == "object"
            ? existing : undefined
        // this.items = {}
        this.pages = pagesURLs
    

        let cont = true
        for (let i = 0; i < this.pages.length; i++) {
            if (cont !== 1)
                cont = await this.getPageSrc(i)
            //^ popuates ungotten SRC slots with undefined if cont becomes not exactly "true"
            //^ populates our handler
            this.makePage(i)
            if (cont === false) break
        }

        this.buttons = {
            "back": "previous-page-button",
            "next": "next-page-button",
            "done": "done-button"
        }
        this.importButtons()

        this.currentPage = 0
        await this.setPage()
        //^ -1 for back, 1 for front, == false for redraw
    }

    // population

    importButtons(IDs) {
        IDs = typeof IDs == "object" 
            ? IDS : this.buttons

        Object.keys(IDs).forEach(dir => 
            this.buttons[dir] = document.getElementById(IDs[dir]) )
    }

    async getPageSrc(index) {

    }

    makePage(index) {

    }

    makeItem(id, existing) {

    }

    // interaction

    nextPage() {}

    prevPage() {}

    done() {}

    async setPage() {
        if (this.pages[this.currentPage] === undefined) {
            this.getPageSrc(this.currentPage)

        }
        return
    }


    selectOther(id) {
        let alt = document.createElement('input')
        alt.type = "text"
        alt.id = fieldItems.dom.id
        alt.placeholder = "List: Backspace"

        fieldItems.dom.parentNode.replaceChild(alt, fieldItems.dom)
        fieldItems['old'] = fieldItems.dom
        fieldItems.dom = alt

        fieldItems.dom.addEventListener('change', () => this.update(fieldItems.dom))
        fieldItems.dom.addEventListener('keyup', e => {
            if (e.keyCode === 8 && fieldItems.dom.value.length == 0) this.swapBack(fieldItems) } )
    }

    selectList(id) {
        if (!fieldItems.old) return
        delete this.out[fieldItems.dom.id]
        
        console.log(fieldItems)
        fieldItems.old.selectedIndex = 0
        fieldItems.dom.parentNode.replaceChild(fieldItems.old, fieldItems.dom)
        fieldItems.dom = fieldItems.old
    }

    error(id) {
        let target = errored.placeholder == 'profile-url' ? errored.parentNode : errored
        if (off) target.classList.remove('errored')
        else target.classList.add('errored')
    }

    // io

    changeItem(id, specs) {

    }

    updateItem(id) {

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

module.exports.default = Application
