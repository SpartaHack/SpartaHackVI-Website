const validators = require('./helpers/validators')
const request = require('request')

// const sendApp = require('./helpers/appTransactions').sendApp

class AppHandler {
    constructor(valDicts, existing) {
        this.valDicts = valDicts
        Object.keys(valDicts).forEach(
            dk => this.getDict(dk, valDicts[dk]) )
        this.validators = validators

        this.items = {}
        this.existing
        this.saveIsCurrent
        this.import(existing)
    }

    getDict(id, src, cb) {
        this.valDicts[id] = false

        let dictRq = {
            headers: { 
                "Content-Type": "application/json" 
            },
            url: window.location.origin + "/data/" + src,
            json: true
        }
        let dictCb = (err, response, body) => {
            if (response && response.code === 200) {
                this.valDicts[id] = body
                if (cb) cb()
            }
        }

        request.get(dictRq, dictCb)
    }

    fromDict(query, dictId, againstField, strict) {
        if (!this.valDicts[dictId]) return
        if (typeof this.valDicts[dictId] === "string")
            this.getDict(dictId, this.valDicts[dictId], 
                () => this.startAutoComplete(query, dictId) )
        else {
            query = query.toLowerCase()
            againstField = typeof againstField == "string"
                ? againstField : "name"

            let compare = strict ? (query, against) => against.search(query) === 0
                : (query, against) => against.search(query) !== -1
                
            let found = this.valDicts[dictId].filter(
                item => compare(item[againstField].toLowerCase(), query) )

            return found[0] ? found : false
        }
        return
    }

    import(item) {
        if (!item || !item.name || !item.validator) return
        let itemInfo = {
            "name": item.name,
            "validator": item.validator,
            "optional": item.optional 
                ? item.optional : false,
            "out": item.out ? ( Array.isArray(item.out) 
                ? item.out : [item.out] ) : item.name
        }

        if (item.autoComplete)
        this.items[itemInfo.name] = itemInfo
        return true

    }

    //validation

    validate(id) {

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

    formCompletion() {
        return
    }

    // io

    save() {

    }
    
    updateSave() {
        if (this.saveIsCurrent === undefined) {

        }
        else if (this.saveIsCurrent === false) {

        }
        else {
            return
        }

        this.saveIsCurrent = true
        return true
    }
    
    export(final) {
        return
    }
   
}

module.exports.default = AppHandler