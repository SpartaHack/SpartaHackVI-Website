const specialInput = require('./__specialInput').default

class otherThanListed extends specialInput{
    constructor(director, components) {
        super(director, components)

        components['altInput'] = this.other
        this.director.setComponents(this.id, components)
    }

    get other() {
        let input = document.createElement('input')
        input.type = "text"
        input.id = this.id
        input.placeholder = "List: Backspace"

        input.addEventListener('keyup', e => {
            if (!input.value.length && e.keyCode == 8) 
                this.swapInput()
        })

        return input
    }

    swapInput(components) {
        components = components ? components : this.components
        if (!components.input || !components.altInput) 
            return components

        components.inputWrap.removeChild(components.input)

        let temp = components.input
        components.input = components.altInput
        components.altInput = temp

        components.inputWrap.appendChild(components.input)

        return components
    }

    eventHook(components) {
        let val = this.director.getInputVal(this.id)

        if (components.input != this.other && val == "Other")
            components = this.swapInput(components)
        
        return components

    }
}

module.exports.default = 
    (director, components, args) => new otherThanListed(director, components)
