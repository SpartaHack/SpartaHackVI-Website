const validators = require('./helpers/validators').default

class Handler {
    constructor(auth, user, submit) {
        this.auth = auth
        this.user = user
        this.submitFunc = submit

        this.items = {}
        this.filters = {}
        this.validators = validators

        this._needed = new Set()
        this._notNeeded = new Set()
        this.out = {}
    }

    get token() { return this.user.pt }

    get needed() { return Array.from(this._needed) }

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
    
    submit(director) { this.submitFunc(this, director) }
    logout() 
        { this.auth.logout({ returnTo: window.location.origin }) }
}

module.exports.default = Handler
