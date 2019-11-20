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
                console.log(savedValue)
    
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
        
        if (!worked) this.error(src, worked)
        else 
            localStorage.setItem(src.id, 
                fieldItems.dom instanceof HTMLSelectElement ? 
                fieldItems.dom.selectedIndex : fieldItems.dom.value )
        
        fieldItems['needed'] = !fieldItems['needed'] ? 
            fieldItems['needed'] : !(Boolean(worked))
            
        return worked
    }

    error(errored, type) {
        if (!(errored instanceof Element) || !this.fields[errored.id]) 
            return
        
        let fatal = !(this.optional.has(errored.id))

        if (fatal)
            this.fields[errored.id].needed = true
        
        localStorage.removeItem(errored.id)            
        delete this.out[errored.id]
        this.domError(errored)

        return fatal
    }

    domError(errored) {

    }

    errorAll(errored) {
        if (!Array.isArray(errored) || errored.length == 0) return

        let fatal = false
        for (var i = 0; i < errored.length; i++) {
            fatal = this.error(this.fields[errored[i]].dom)

            if  (fatal) break
        }
        return fatal
    }

    export() {
        let stillNeeded = []

        Object.keys(this.fields).forEach(fn => {
            if (!this.update(this.fields[fn].dom)) 
                stillNeeded.push(fn)
        })

        return stillNeeded
    }

    submit() {
       if (this.errorAll(this.export())) {
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
