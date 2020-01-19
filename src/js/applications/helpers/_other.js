let fromList = components => {
    components.wrap.replaceChild(components.input, components.input2)
    delete components.input2
}

let typeOther = (director, id) => {
    let components = director.getComponents(id)

    console.log(director, id, components)



    other.addEventListener('keyup', e => {
        if (other.value.length === 0 && e.keyCode === 8)
            fromList(components)
    })

    

    components.input2 = other
    components.inputWrap.replaceChild(components.input2, components.input)

    other.addEventListener('input', 
        e => director.update(id, other) )
}

let ready = (director, components, args) => {
    components.input.addEventListener('change', () => {
        let selected = components.input
                      .childNodes[components.input.selectedIndex]

        if (selected.value === "other" || selected.value === "Other")
            typeOther(director, args.name, components)
    })

}

const specialInput = require('./__specialInput').default

class otherThanListed extends specialInput{
    constructor(director, id) {
        this.super(director, id)

        let other = document.createElement('input')
        other.type = "text"
        other.id = id
        other.placeholder = "List: Backspace"
    }

    showOther() {

    }

    showListed() {

    }

    itemChanged() {
        if (director.getVal(this.id) == "!!OTHER!") {
            this.showListed
        }
    }
}

module.exports.default = ready
