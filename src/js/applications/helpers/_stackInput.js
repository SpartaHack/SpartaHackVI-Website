const specialInput = require('./__specialInput').default
const utfAlpha = 41

class stackInput  extends specialInput{
    constructor(director, id) {
        this.super(director, id)
        components['stackControls'] = this.getDom()
        components.controlWrap.appendChild(components.stackControls.wrap)

        this.id = components.input.id
        this.director = director
        this.components = components

        this.entries = []


    }

    getDom() {
        let items = {
            "m": document.createElement('p'),
            "p": document.createElement('p'),
            "wrap": document.createElement('span'),
        }
    
        items.m.innerHTML = '-'
        items.p.innerHTML = '+'
        items.wrap.appendChild(items.m)
        items.wrap.appendChild(items.p)
        items.wrap.className = 'list-input-control'
    
        return items
    }

    save() {
        if (this.director.handler.validate(this.id, this.entries))
            this.components.input.dataset['trueVal'] = JSON.stringify(this.entries)
        else while(this.removeEntry()) {}
    }

    removeEntry() {
        let last = this.entries.pop()
        last = last ? last : ""
        this.director.insert(this.id, last)

        this.save()

        return last === "" ? undefined : true
    }
    addEntry() {
        if (!this.director.update(this.id, this.components.input)) {
            console.log(this.director.update(this.id, this.components.input))
            return
        }

        this.entries.push(this.director.getVal(this.id))
        this.director.insert(this.id, "")

        this.save()
    }


}

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

module.exports.default = (director, components, args) =>
    new stackInput(director, components)
