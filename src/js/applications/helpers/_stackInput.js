const specialInput = require('./__specialInput').default

class stackInput  extends specialInput{
    constructor(director, components) {
        super(director, components)
        this.entries = []
        this.currentInStack = false

        components['stackControls'] = this.getDom()
        components.controlWrap.appendChild(components.stackControls.wrap)
        this.director.setComponents(this.id, components)
    }

    getDom() {
        let items = {
            "m": document.createElement('p'),
            "p": document.createElement('p'),
            "wrap": document.createElement('span'),
        }
        items.wrap.className = 'list-input-control'
    
        items.p.innerHTML = '+'
        items.p.addEventListener('click', e => this.newEntry())
        items.wrap.appendChild(items.p)

        items.m.innerHTML = '-'
        items.m.addEventListener('click', e => this.removeEntry())
    
        return items
    }

    eventHook(components) {
        components['trueVal'] = this.entries

        let current = this.curVal
        if (current !== "" && current !== undefined)
            components.trueVal.push(current)

        return components
    }

    removeEntry() {
        let last = this.entries[0] ? this.entries.pop() : ''
        
        this.director.insert(this.id, last)

        return Boolean(this.entries[0])
        // indicate if there are values left in the stack
    }

    newEntry() {
        let current = this.curVal
        console.log(current)
        
        if (current === "" || current === undefined) {
            // error code?
            return
        }

        this.entries.push(current)
        this.director.insert(this.id, "")
    }
}
module.exports.default = (director, components, args) =>
    new stackInput(director, components)

// ---

let validate = (value, compFunc) => {
    if (!Array.isArray(value)) return

    let origLen = value.length,
        out = [], thisVal, i

    for (let i = 0; i < origLen; i++) {
        thisVal = compFunc(value[i])
        if (!thisVal) break
        out.push(thisVal)
    }

    return i === origLen ? out : undefined
}
module.exports.validate = validate
