

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
            "wrap": document.createElement('span'),
            "p": document.createElement('i'),
            "m": document.createElement('i')
        }
    
        items.p.className = 'fas fa-plus-circle'
        items.m.className = 'fas fa-minus-circle'
        items.wrap.appendChild(items.p)
        items.wrap.appendChild(items.m)
    
        return items
    }

    save() {
        this.components.input.dataset['trueVal'] = JSON.stringify(this.entries)
    }

    removeEntry() {
        let last = this.entries.pop()
        last = last ? last : ""
        this.director.insert(this.id, last)

        this.save()
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

let ready = (director, components, args) => {
    new stackInput(director, components)
}


module.exports.default = ready
