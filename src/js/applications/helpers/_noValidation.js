const specialInput = require('./__specialInput').default

class notFound extends specialInput{
    constructor(director, components) {
        super(director, components)
        this.items = {
            'wrap': document.createElement('span'),
            'label': document.createElement('p'),
            'check': document.createElement('input')
        }

        this.items.label.innerHTML = 'N/A'
        this.items.check.type = "checkbox"
        this.items.check.className= "answer-not-found-indicator"

        this.items.wrap.className = 'answer-not-found-wrap'
        this.items.wrap.appendChild(this.items.label)
        this.items.wrap.appendChild(this.items.check)
        
        components.controlWrap.appendChild(this.items.wrap)
        components['notFoundControl'] = this.items
        this.director.setComponents(this.id, components)

        this.items.check.addEventListener('change', e => this.director.update(this.id))
    }

    eventHook(components) {
        let onScreen = components.controlWrap.contains(this.items.wrap)
        let valid = this.director.handler.validate(this.id, this.curVal)

        if (valid && onScreen)
            components.controlWrap.removeChild(this.items.wrap)
            
        else if (!valid && !onScreen)
            components.controlWrap.appendChild(this.items.wrap)

        if (onScreen && this.items.check.checked == true)
            components['noValidate'] = true
        
        return components
    }
}

module.exports.default = (director, components, args) => new notFound(director, components)