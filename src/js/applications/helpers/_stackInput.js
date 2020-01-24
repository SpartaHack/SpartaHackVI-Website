const specialInput = require('./__specialInput').default

class stackInput  extends specialInput{
    constructor(director, components) {
        super(director, components)
        this.entries = []
        this.last

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
        items.wrap.className = 'list-input-control noPreviousListed'

        items.m.innerHTML = '-'
        items.m.className = 'remove-last-entry'
        items.m.addEventListener('click', e => this.removeEntry())
        items.wrap.appendChild(items.m)

        items.p.innerHTML = '+'
        items.p.className = 'add-new-entry'
        items.p.addEventListener('click', e => this.newEntry(true))

        items.wrap.appendChild(items.p)
    
        return items
    }

    set lastRecent(val) {
        if (this.last === undefined || val !== this.last) {
            this.last = val
            this.entries.push(val)
        }
    }

    importHook(components, value) {
        if (Array.isArray(value) && value.length > 1) {
            this.entries = value
            this.components.stackControls.wrap.classList.remove('noPreviousListed')
        }
        return components
    }

    eventHook(components) {
        components['trueVal'] = this.entries
        console.log("@stack", components)
        this.newEntry()

        return components
    }

    removeEntry() {
        let last = this.entries.pop()

        if (last == this.curVal)
            last = this.entries.pop()

        this.director.insert(this.id, last)        
        
        if (!this.entries[0]) 
            this.components.stackControls.wrap.classList.add('noPreviousListed')
    }

    newEntry(refresh) {
        let current = this.curVal
        if (current === "" || current === undefined)
            return
        let currentEnd = this.entries.pop()
        if (current != currentEnd) {
            if (currentEnd !== undefined)
                this.entries.push(currentEnd)
            this.entries.push(current)
        }
        if (refresh)
            this.director.insert(this.id, "", true)

        this.components.stackControls.wrap.classList.remove('noPreviousListed')

    }

    
}
module.exports.default = (director, components, args) =>
    new stackInput(director, components)

// ---

let validate = (value, compFunc) => {
    if (!Array.isArray(value)) return
    let origLen = value.length,
        out = [], i = 0, thisVal

    for (i = 0; i < origLen; i++) {
        thisVal = compFunc(value[i])

        if (!thisVal) break

        out.push(thisVal)
    }
    return i > 0 && i === origLen ? out : undefined
}
module.exports.validate = validate
