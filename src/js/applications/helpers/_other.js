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

        if (this.director.fromApi) input.readOnly = true
        else {
            input.addEventListener('keyup', e => {
                if (!input.value.length && e.keyCode == 8) 
                    this.swapInput()
            })
        }

        return input
    }

    swapInput(components) {
        components = components ? components : this.components
        if (!components.input || !components.altInput) 
            return components

        let temp = components.input
        components.input = components.altInput
        components.altInput = temp

        components.inputWrap.replaceChild(components.input, components.altInput)

        return components
    }

    importHook(components, value) {
        let val, found, opts = components.input.childNodes

        if (Array.isArray(value)) {
            if (value[0])
                val = value[value.length - 1]
            else return
        }
        else val = value
        
        for (let i = 0; i < opts.length; i++) {
            if (opts[i].value == val) {
                found = true
                break
            }
        } return found 
            ? components : this.swapInput(components)
    }

    eventHook(components) {
        let val = this.director.getInputVal(this.id)
    
        if (components.input != this.other && val == "Other")
            components = this.swapInput(components)
        else if (components.input.type == "text") {

            let opts = components.altInput.childNodes
            console.log(opts)
            for (let i = 0; i < opts.length; i++) {
                if (opts[i].value == val) {
                    opts = i
                    break
                }
            }
            if (Number.isInteger(opts)) {
                components = this.swapInput(components)
                components.input.selectedIndex = ++opts
            }
        }
        
        return components

    }
}

module.exports.default = 
    (director, components, args) => new otherThanListed(director, components)
