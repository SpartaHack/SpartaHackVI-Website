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
                'error': true
            },
            'university': {
                'validator': validators.fromDict,
                'autocomplete': true,
                'needed': true,
                'dom': undefined,
                'error': true
            },
            'major': {
                'validator': validators.fromDict,
                'autocomplete': true,
                'needed': true,
                'dom': undefined,
                'error': true
            },
            'devpost': {
                'validator': validators.devpost,
                'needed': false,
                'dom': undefined,
                'error': true
            },
            'github': {
                'validator': validators.github,
                'needed': false,
                'dom': undefined,
                'error': true
            },
            'linkedin': {
                'validator': validators.linkedin,
                'needed': false,
                'dom': undefined,
                'error': true
            },
            'other-site': {
                'validator': validators.otherSite,
                'needed': false,
                'dom': undefined,
                'error': true
            },
            'birthday': {
                'validator': validators.birthday,
                'needed': true,
                'dom': undefined,
                'error': true
            },
            'grad-season-opts': {
                'validator': validators.select,
                'needed': true,
                'dom': undefined,
                'error': true
            },
            'grad-year-opts': {
                'validator': validators.select,
                'needed': true,
                'dom': undefined,
                'error': true
            },
            'mlh-experience': {
                'validator': validators.mlh,
                'needed': true,
                'dom': undefined,
                'error': true
            },
            'gender-opts': {
                'validator': validators.select,
                'needed': true,
                'dom': undefined,
                'error': true
            },
            'statement': {
                'validator': validators.statement,
                'needed': true,
                'dom': undefined,
                'error': true
            }
        }

        this.optional = new Set(['devpost','github','linkedin','other-site'])
        this.out = {}

        Object.keys(this.fields).forEach(f => {
            let savedValue = localStorage.getItem(f)

            if (savedValue && savedValue != "undefined") {
                this.import(document.getElementById(f))
                let savedTarget = this.fields[f].dom
    
                if (savedTarget instanceof HTMLSelectElement) 
                    savedTarget.selectedIndex = savedValue
                else savedTarget.value = savedValue

                this.fields[f].dom.parentNode.replaceChild(this.fields[f].dom, savedTarget)
            }

        })       
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

    domError(errored, off) {
        let target = errored.placeholder == 'profile-url' ? errored.parentNode : errored
        if (off) target.classList.remove('errored')
        else target.classList.add('errored')
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

    submit() {
        let stillNeeded = this.export()
        console.log(stillNeeded)
        if (stillNeeded.length) {
            //UI form incompletion notification
            console.log('form not done')
        }
        else {
            // post request
            console.log('form done')
        }
       console.log(this.out)
    }
}

module.exports.default = Application
