// import via CB
class specialIput {
    constructor(director, components) {
        this.id = components.input.id
        this.director = director
    }

    get curVal() { return this.director.getInputVal(this.id) }
    get components() { return this.director.getComponents(this.id) }

    // ---
    
    eventHook() { console.log('implement me!') }

    doValidate() { this.validate = true }

    noValidate() { this.validate = false }
}

module.exports.default = specialIput
