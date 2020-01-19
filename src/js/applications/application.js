const validators = require('./helpers/validators').default
const request = require('request')

// const sendApp = require('./helpers/appTransactions').sendApp

class AppHandler {
    constructor(valDicts, existing) {
        this.items = {}
        this.filters = {}
        this.validators = validators

        this._needed = new Set()
        this.out = {}
    }

    importFilter(id, filterSrc) { 
        if (Array.isArray(filterSrc)) this.filters[id] = filterSrc
    }
    getFilter(id) { return this.filters[id] }

    getError(id) {
        // implement a more fully featured wrapper function
        let item = this.items[id]
        return !item ? undefined :
        ( item.error ? item.error 
        : (item.label ? item.label : item.name) )
    }

    get needed() { return Array.from(this._needed) }

    import(item) {
        // console.log("import", item)
        if (!item || !item.name) return
        let itemInfo = {
            "name": item.name,
            "validate": (item.validate || item.validate === false) ? item.validator : item.name,
            "optional": item.optional ? item.optional : false,
            "error": item.error,
            "out": item.out 
                ? ( Array.isArray(item.out) 
                    ? item.out : [item.out] ) : item.name
        }

        this.items[itemInfo.name] = itemInfo
        if (!itemInfo.optional)
            this._needed.add(itemInfo.name)
        return true
    }

    validate(id, value) {
        let item = this.items[id]
        let out = this.items[id].out
            ? this.items[id].out : this.items[id].name
        out = Array.isArray(out) ? out : [out]
        // console.log(id, this.items, item)
        let valid = !item.validate
            ? true : this.validators[item.validate](value, this)

        // console.log(valid, id, value)
        if (valid) {
            this._needed.delete(id)


            
            let importValues = valid === true ? value : valid
            importValues = (Array.isArray(importValues) 
                ? importValues : [importValues])

            for (let i = 0; i < importValues.length; i++)
                this.out[out[i]] = importValues[i]

            console.log(this.out, this._needed)
            return true
        }
        
        out.forEach(field => delete this.out[field])
        this._needed.add(id)
        return
    }
    
    submit(overlayDom) {
        return
    }
   
}
module.exports.default = AppHandler
