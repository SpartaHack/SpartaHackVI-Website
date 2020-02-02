const specialInput = require('./__specialInput').default

class stackInput  extends specialInput{
    constructor(director, components) {
        super(director, components)
        this.entries = []
        this.curPos = -1
        this.maxPos = -1

        components['stackControls'] = this.getDom()
        components.controlWrap.appendChild(components.stackControls.wrap)
        this.director.setComponents(this.id, components)
    }

    getDom() {
        let items = {
            "p": document.createElement('p'),
            "l": document.createElement('p'),
            "wrap": document.createElement('span'),
        }
        items.wrap.className = 'list-input-control noPreviousListed'

        items.p.innerHTML = '<'
        items.p.className = 'see-last-entry'
        items.p.addEventListener('click', e => this.prevEntry())
        items.wrap.appendChild(items.p)

        items.l.innerHTML = '>'
        items.l.className = 'see-next-entry'
        items.l.addEventListener('click', e => this.nextEntry())
        items.wrap.appendChild(items.l)
    
        return items
    }

    prevEntry() {
        if (this.curPos == -1) return

        this.curPos = this.curPos === 0 
            ? this.maxPos : this.curPos - 1

        
        this.director.insert(this.id, "Other")
        this.director.update(this.id)
        this.director.insert(this.id, this.entries[this.curPos])
        this.director.update(this.id)
    }

    nextEntry() {
        if (this.curPos == -1) return

        this.curPos = this.curPos == this.maxPos
            ? 0 : this.curPos + 1

        
        this.director.insert(this.id, "Other")
        this.director.update(this.id)
        this.director.insert(this.id, this.entries[this.curPos])
        this.director.update(this.id)
    }

    importHook(components, value) {
        if (Array.isArray(value) && value.length > 1) {
            this.curPos = 0
            this.entries = value
            this.maxPos = this.entries.length - 1
            components.stackControls.wrap.classList.remove('noPreviousListed')
        }
        else
            components.controlWrap.removeChild(components.stackControls.wrap)
        return components
    }

    eventHook(components) {
        if (this.curPos == -1) 
            return components
            
        this.director.insert(this.id, this.entries[this.curPos])
        return components

    }
}
module.exports.default = (director, components, args) =>
    new stackInput(director, components)
