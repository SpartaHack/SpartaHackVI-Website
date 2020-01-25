const validators = require('./helpers/validators').default

const request = require('request')

// const sendApp = require('.//appTransactions').sendApp

class AppHandler {
    constructor(valDicts, existing) {
        this.items = {}
        this.filters = {}
        this.validators = validators

        this._needed = new Set()
        this._notNeeded = new Set()
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
        if (!item || !item.name) return
        let itemInfo = {
            "name": item.name,
            "validate": (item.validate || item.validate === false) ? item.validate : item.name,
            "optional": item.optional ? item.optional : false,
            "error": item.error,
            "out": item.out ? item.out : item.name
        }

        this.items[itemInfo.name] = itemInfo
        if (itemInfo.optional)
            this._notNeeded.add(itemInfo.name)
        else this._needed.add(itemInfo.name)
        
        return true
    }

    validate(id, value) {
        let item = this.items[id]
        if (!item) return
        if (!value && this._notNeeded.has(id)) {
            this.out[id] = undefined
            return true
        }
        
        let out = item.out ? item.out : item.name,
            valid = !item.validate ? true 
                : this.validators[item.validate](value, this)

        value = valid && valid !== true ? valid : value
        if (valid) {
            if (value instanceof Object && !Array.isArray(value))
                Object.keys(value).forEach(
                    v => this.out[v] = value[v] )

            else this.out[out] = value

            this._needed.delete(id)
            return true
        }

        if (value instanceof Object)
            Object.keys(value).forEach(
                v => delete this.out[v] )

        else delete this.out[out]
        return
    }
    
    submit(overlayDom) {
        this.out['other_university'] = ""
        this.out['outside_north_america'] = ""

        let info = JSON.parse(window.localStorage.getItem('stuinfo')),
        out = this.out
        if (!info) { 
            console.error("Please log out, log back in, then try again")
            return
        }
        console.log("WOULD SUBMIT!!", this.out)
    
        let submitRq = {
            headers: {
                "Content-Type":"application/json",
                "Access-Control-Allow-Origin": "http://api.elephant.spartahack.com",
                "Access-Control-Request-Method": "POST",
                "X-WWW-USER-TOKEN": info[window.location.origin + "/pt"]
            },
            body: { "application": out },
            url: "http://api.elephant.spartahack.com/applications",
            json: true
        }
        let submitApp = (err, response, body) => {
            console.log(err, body)
        }
    
        request.post(submitRq, submitApp)
        return
    }
   
}
module.exports.default = AppHandler
