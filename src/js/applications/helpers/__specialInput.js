class specialIput {
    constructor(director, id) {
        this.id = id
    }

    get components() { return director.getComponents(id) }

    set components(newComps) { director.domItems[this.id] = newComps }

    get eventHook() {
        console.log('implement me!')        
    }


}

module.exports.default = specialIput