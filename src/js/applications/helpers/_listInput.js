

// selectList(id) {
//     if (!fieldItems.old) return
//     delete this.out[fieldItems.dom.id]
    
//     console.log(fieldItems)
//     fieldItems.old.selectedIndex = 0
//     fieldItems.dom.parentNode.replaceChild(fieldItems.old, fieldItems.dom)
//     fieldItems.dom = fieldItems.old
// }
const utfAlpha = 41

class stackInput {
    constructor(director, components) {
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
