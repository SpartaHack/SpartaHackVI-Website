const validators = require('./helpers/validators')
const request = require('request')

// const sendApp = require('./helpers/appTransactions').sendApp

class AppHandler {
    constructor(valDicts, existing) {
        this.items = {}
        this.validators = validators

        this._needed = new Set()
        this.out = {}
    }

    get needed() { return Array.from(this._needed) }

    import(item) {
        console.log("import", item)
        if (!item || !item.name || !item.validator) return
        let itemInfo = {
            "name": item.name,
            "validator": item.validator,
            "optional": item.optional 
                ? item.optional : false,
            "out": item.out ? ( Array.isArray(item.out) 
                ? item.out : [item.out] ) : item.name
        }

        this.items[itemInfo.name] = itemInfo
        if (!itemInfo.optional)
            this._needed.add(itemInfo.name)
        return true
    }

    validate(id, value) {
        console.log("validate", id, value)
        let item = this.items[id]
        let valid = item.validate === false 
            ? true : ( item.validate 
            ? this.validators[item.validate](value) 
                : this.validators[id](value) )

        console.log('cool -- ', valid)

        if (valid) {
            this._needed.delete(id)

            let out = this.items[id].out
                ? this.items[id].out : this.items[id].name
            out = Array.isArray(out) ? out : [out]
            
            let importValues = valid === true ? value : valid
            importValues = (Array.isArray(importValues) 
                ? importValues : [importValues])

            for (let i = 0; i < importValues.length; i++)
                this.out[out[i]] = importValues[i]

            return true
        }
        this._needed.add(id)
        return
    }
    
    submit(overlayDom) {
        return
    }
   
}
module.exports.default = AppHandler
