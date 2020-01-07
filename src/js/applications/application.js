const validators = require('./helpers/validators')
const sendApp = require('./helpers/appTransactions').sendApp

class AppHandler {
    constructor() {
        this.validators = validators

        this.existing = await this.getCurrent()
        this.items = {}
        this.currentSave
        // this.new = Boolean(Object.keys(this.src)[0])        
    }
    import(nameitem) {

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
        if (this.currentSave === undefined) {

        }
        else if (this.currentSave === false) {

        }
        else {
            return
        }

        this.currentSave = true
        return true
    }
    
    export(final) {
        return
    }
   
}