const validators = require('./validators')
const autocomplete = require('./autocomplete').default

class Application {
    constructor() {
        this.fields = {
            'travel-origin': {
                'validator': validators.fromDict,
                'autocomplete': true,
                'needed': true,
                'dom': undefined,
                'error': 'Travel Origin'
            },
            'university': {
                'validator': validators.fromDict,
                'autocomplete': true,
                'needed': true,
                'dom': undefined,
                'error': 'University'
            },
            'major': {
                'validator': validators.fromDict,
                'autocomplete': true,
                'needed': true,
                'dom': undefined,
                'error': 'Major'
            },
            'devpost': {
                'validator': validators.devpost,
                'needed': false,
                'dom': undefined,
                'error': 'Devpost profile address'
            },
            'github': {
                'validator': validators.github,
                'needed': false,
                'dom': undefined,
                'error': 'Devpost profile address'
            },
            'linkedin': {
                'validator': validators.linkedin,
                'needed': false,
                'dom': undefined,
                'error': 'Devpost profile address'
            },
            'other-site': {
                'validator': validators.otherSite,
                'needed': false,
                'dom': undefined,
                'error': 'Other website'
            },
            'birthday': {
                'validator': validators.birthday,
                'needed': true,
                'dom': undefined,
                'error': 'Birthday'
            },
            'grad-season-opts': {
                'validator': validators.select,
                'needed': true,
                'dom': undefined,
                'error': 'Graduation Season'
            },
            'grad-year-opts': {
                'validator': validators.select,
                'needed': true,
                'dom': undefined,
                'error': 'Graduation Year'
            },
            'mlh-experience': {
                'validator': validators.mlh,
                'needed': true,
                'dom': undefined,
                'error': 'Number of Hackathons'
            },
            'gender-opts': {
                'validator': validators.select,
                'needed': true,
                'dom': undefined,
                'error': 'Gender'
            },
            'statement': {
                'validator': validators.statement,
                'needed': true,
                'dom': undefined,
                'error': 'Personal Statement'
            }
        }

        this.optional = new Set(['devpost','github','linkedin','other-site'])
        this.out = {}

        Object.keys(this.fields).forEach(f => {
            let fieldItems = this.import(document.getElementById(f))
            if (fieldItems) {
                let savedValue = localStorage.getItem(f)
    
                if (savedValue && savedValue != "undefined") {
                    
                    let savedTarget = this.fields[f].dom
        
                    if (savedTarget instanceof HTMLSelectElement) 
                        savedTarget.selectedIndex = savedValue
                    else savedTarget.value = savedValue
    
                    this.fields[f].dom.parentNode.replaceChild(this.fields[f].dom, savedTarget)
                }
            }
        })       
    }

    submit() {
        let stillNeeded = this.export()
        let neededReport = this.report(stillNeeded)
        
        if (neededReport) {
            //UI form incompletion notification
            console.log('form not done')
            document.body.appendChild(neededReport)
        }
        else {
            // post request
            console.log('form done')
        }
       console.log(this.out)
    }

    import(src) {
        if (!src instanceof HTMLInputElement || !src instanceof HTMLSelectElement) return

        let fieldItems = this.fields[src.id]
        if (!fieldItems) return

        if (fieldItems.dom === undefined || fieldItems.dom != src) {
            fieldItems.dom = src
            
            if (fieldItems.autocomplete) 
                autocomplete(src, this)
                
            src.addEventListener('change', () => this.update(this.fields[src.id].dom))
        }
        return fieldItems
    }
    export() {
        let stillNeeded = []

        Object.keys(this.fields).forEach(fn => {
            let updated = this.update(this.fields[fn].dom)
            let opt = this.optional.has(fn)

            if ((opt && updated == -1) || (!opt && !updated)) 
                stillNeeded.push(fn)
        })

        return stillNeeded
    }

    update(src) {
        let fieldItems = this.import(src)
        if (!fieldItems) return undefined;
        
        let func = fieldItems['validator']
        let worked = func(src, this.out)

        this.fields[src.id].needed = this.fields[src.id].needed ? 
            !(Boolean(worked)) : this.fields[src.id].needed

        if (worked !== true) this.error(src, worked)
        else {
            localStorage.setItem(src.id, 
            fieldItems.dom instanceof HTMLSelectElement ? fieldItems.dom.selectedIndex : fieldItems.dom.value )
            
            this.domError(src, true)
        }

        return worked
    }

    domError(errored, off) {
        let target = errored.placeholder == 'profile-url' ? errored.parentNode : errored
        if (off) target.classList.remove('errored')
        else target.classList.add('errored')
    }

    error(errored, type) {
        let fieldItems = this.import(errored)
        if (!fieldItems) return undefined;
        
        localStorage.removeItem(errored.id)
        delete this.out[errored.id]

        let optional = this.optional.has(errored.id)
        if ((optional && type === -1) || !optional)
            this.domError(errored)

        return true
    }    

    report(needed) {
        if (!Array.isArray(needed) || !needed.length) return

        let exitWrap = document.createElement('div')
        exitWrap.id = 'report-incomplete-bg'

        let reportWrap = document.createElement('aside')
        reportWrap.id = 'report-incomplete'

        reportWrap.appendChild(document.createElement('h3'))
        reportWrap.appendChild(document.createElement('p'))

        reportWrap.firstChild.innerHTML = 'Application Incomplete'
        reportWrap.firstChild.id = 'report-title'

        reportWrap.lastChild.innerHTML = 'The following fields need to be changed or completed'
        reportWrap.lastChild.id = 'report-summary'

        reportWrap.appendChild(document.createElement('ul'))
        reportWrap.lastChild.id = 'needed-fields'

        needed.forEach(nf => {
            reportWrap.lastChild.appendChild(document.createElement('li'))
            reportWrap.lastChild.lastChild.innerHTML = this.fields[nf].error
        })

        reportWrap.appendChild(document.createElement('div'))
        
        let exitButton = document.createElement('button')
        exitButton.id="exit-button"
        exitButton.innerHTML = "Exit"
        reportWrap.lastChild.appendChild(exitButton)    

        let completeButton = document.createElement('button')
        completeButton.innerHTML = "Complete"
        completeButton.id="complete-button"
        reportWrap.lastChild.appendChild(completeButton)
        
        let removeModal = () => document.body.removeChild(exitWrap)
        exitButton.addEventListener('click', removeModal)

        exitWrap.appendChild(reportWrap)
        return exitWrap  
    }
}

module.exports.default = Application
