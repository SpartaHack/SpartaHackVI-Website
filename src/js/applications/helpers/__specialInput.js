// import via CB
class specialIput {
    constructor(director, components) {
        this.id = components.input.id
        this.director = director
    }

    get curVal() { this.director.getInputVal(this.id) }
    get components() { return this.director.getComponents(this.id) }

    // ---
    
    eventHook() { console.log('implement me!') }

    listen(cb, event) {
        // cb should probably refer to "this" for consistent validation
        event = event ? event : 'keyup'
        this.components.inputWrap.addEventListener(
            event, e => cb() )
    }

    // ---

    doValidate() { this.validate = true }

    noValidate() { this.validate = false }
}

module.exports.default = specialIput
