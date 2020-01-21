const specialInput = require('./__specialInput').default

class stackInput  extends specialInput{
    constructor(director, components) {
        super(director, components)
        this.entries = []
        this.isFirst = true
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
        if (this.last !== undefined) this.isFirst = false
    }

    eventHook(components) {
        components['trueVal'] = this.entries

        let current = this.curVal
        // console.log(current)
        if (current !== "" && current !== undefined)
            this.lastRecent = current
        // console.log("--", current)
        return components
    }

    removeEntry() {
        if (!this.entries[0])
            this.components.stackControls.wrap.classList.add('noPreviousListed')
    
        this.director.insert(this.id, this.entries.pop())
    }

    newEntry(alreadySaved) {
        let current = this.curVal

        if (current === "" || current === undefined)
            return
        this.components.stackControls.wrap.classList.remove('noPreviousListed')

        this.lastRecent = current
        this.director.insert(this.id, "", true)
    }

    
}
module.exports.default = (director, components, args) =>
    new stackInput(director, components)

// ---

let validate = (value, compFunc) => {
    if (!Array.isArray(value)) return

    let origLen = value.length,
        out = [], thisVal, i

    for (i = 0; i < origLen; i++) {
        thisVal = compFunc(value[i])
        // console.log(thisVal)
        if (!thisVal) break
        out.push(thisVal)
    }
    // console.log(i, origLen)
    return i === origLen ? out : undefined
}
module.exports.validate = validate
