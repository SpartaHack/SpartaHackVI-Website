const validators = require('./helpers/validators').default,
transactions = require('./../transactions')
req = require('./../req')

class AppHandler {
    constructor(auth, user, altSubmit) {
        this.auth = auth
        this.user = user

        this.items = {}
        this.filters = {}
        this.validators = validators

        this._needed = new Set()
        this._notNeeded = new Set()
        this.out = {}
        this.altSubmit = conditions => altSubmit(this, conditions)
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
            "error": item.error ? item.error : item.label,
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
                : this.validators[item.validate](value, out, this)

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
    
    submit(conditions) {
        this.out['other_university'] = ""
        this.out['outside_north_america'] = ""
        console.log(this.out)
        
        let submitRq = {
            headers: {
                "Content-Type":"application/json",
                "Access-Control-Request-Method": "POST",
                "X-WWW-USER-TOKEN": this.user.pt
            },  
            body: this.out,
            url: req.base + "/applications",
            json: true
        },
        submitApp = (err, response, body) => {
            if (body)
                body.status = body.status ? body.status.toString() : "Other"
            else body = {
                'status': 'Other',
                'message': 'Probable CORS issue' 
            }

            if (conditions[body.status]) (conditions[body.status])()
            else if (body.status != "201" && conditions.otherError)
                conditions.otherError(body) 
        }

        req.uest.post(submitRq, submitApp)
        return
    }

    logout() {
        if (this.auth) 
            this.auth.logout(
                { returnTo: window.location.origin })
    }
}
module.exports.default = AppHandler
