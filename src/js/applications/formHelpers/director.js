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
                'needed': true,
                'dom': undefined,
                'error': true
            },
            'github': {
                'validator': validators.github,
                'needed': true,
                'dom': undefined,
                'error': true
            },
            'linkedin': {
                'validator': validators.linkedin,
                'needed': true,
                'dom': undefined,
                'error': true
            },
            'other-site': {
                'validator': validators.otherSite,
                'needed': true,
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
        this.out = {}
    }

    import(src) {
        let fieldItems = this.fields[src.id]

        if (!fieldItems) return
        if (fieldItems.dom === undefined || fieldItems.dom != src) {
            fieldItems.dom = src
            
            if (fieldItems.autocomplete) 
                autocomplete(src, this)
                
            src.addEventListener( 'change',
                () => this.update(this.fields[src.id].dom) )

        }

        return fieldItems
    }

    update(src) {
        let fieldItems = this.import(src)
        if (!fieldItems) return undefined;
        
        let func = fieldItems['validator']
        let worked = func(src, this.out)
        
        if (!worked) this.error(src, worked)
        console.log(this.out)
        
        fieldItems['needed'] = worked
        return worked
    }

    error(errored, type) {
        delete this.out[errored.id]
    }

    export(out) {
        if (typeof out != Object) return undefined

        let stillNeeded = []

        Object.keys(this.fields).forEach(fn => {
            if (this.fields[fn]['needed'])
                stillNeeded.push(n)

            else out[n] = this.out[n]
        })

        return stillNeeded
    }
}

module.exports.default = Application
