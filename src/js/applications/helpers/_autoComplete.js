let request = require('request')
const specialInput = require('./__specialInput').default

class autoCompeteInput extends specialInput {
    constructor(director, components, filterUrl) {
        super(director, components)
        this.curInd = 0
        this.filterSrc
        this.import(filterUrl)

        this.itemWrap = document.createElement('span')
        this.itemWrap.className = 'autocomplete-list'
        this.currentItems = document.createElement('ul')
        this.itemWrap.append(this.currentItems)

        
    }

    eventHook(components) {
        if (this.currentItems.childElementCount && !this.curInd)
            this.currentIndex = 0
        return components
    }

    import(src) {
        let importRq = {
            headers: 
                { "Content-Type":"application/json" },
            url: window.location.origin + src,
            json: true
        }
        
        let importCb = (err, response, body) => {
            if (response && response.statusCode === 200 && Array.isArray(body) ) {
                console.log(body)
                this.filterSrc = body
                this.director.handler.importFilter(this.id, body)
                this.components.inputWrap.addEventListener('keyup', 
                    e => this.route(e.keyCode) )
                this.director.update(this.id)
            }
        }
    
        request.get(importRq, importCb)
    }

    hide() {
        let components = this.components
        if (components.inputWrap.lastChild === this.itemWrap)
            this.itemWrap.classList.add('hide')

        let show = () => {
            this.show()

            components.inputWrap.removeEventListener('focus', show)
            components.inputWrap.removeEventListener('mouseenter', show)
        }
        components.input.addEventListener('focus', show)
        components.inputWrap.addEventListener('mouseenter', show)

        this.director.setComponents(this.id, components)
    }

    show() {
        let components = this.components
        if (!this.currentItems.childElementCount) 
            this.hide()

        else if (components.inputWrap.lastChild.className === 'autocomplete-list')
            this.itemWrap.classList.remove('hide')

        else components.inputWrap.appendChild(this.itemWrap)

        let hide = () => {
            this.hide()

            components.inputWrap.removeEventListener('blur', hide)
            components.inputWrap.removeEventListener('mouseleave', hide)
        }
        this.components.inputWrap.addEventListener('blur', hide)
        this.components.inputWrap.addEventListener('mouseleave', hide)

        this.director.setComponents(this.id, components)
    }

    set currentIndex(val) {
        let current = this.currentItems.childNodes[this.curInd]
        if (current) current.className = ''

        let curCount = this.currentItems.childElementCount    
        val = (!Number.isInteger(val) || val >= curCount) ? 0 :
            (val < 0 ? curCount - 1 : val)
        
        let item = this.currentItems.childNodes[val]
        item.className = 'active-auto'
        this.director.insert(this.id,  item.firstChild.innerHTML)

        this.curInd = val
        item.focus()
    }

    route(keycode) {
        switch (keycode) {
            case 40: 
            this.currentIndex = this.curInd + 1
            break
            case 38: 
            this.currentIndex = this.curInd - 1
            break
            case 13:
            if (!this.curInd)
                this.currentIndex = 0
            this.select(this.currentItems.childNodes[this.curInd])
            break
            default: 
            this.filter()
        }
    }

    filter() {        
        this.clear()
        if (this.components.input.value.length < 3) 
            return

        let query = this.components.input.value.toLowerCase()
        let first = true

        this.filterSrc.forEach(potRes => {
                if (potRes.toLowerCase().search(query) >= 0) {
                    let thisOpt = document.createElement('li')
                    thisOpt.tabIndex = -1
                    if (first) {
                        thisOpt.className = 'active-auto'
                        first = false
                    }

                    thisOpt.appendChild(document.createElement('p'))
                    thisOpt.firstChild.innerHTML = potRes

                    thisOpt.addEventListener('click', 
                        e => this.select(thisOpt) )
                    
                    this.currentItems.appendChild(thisOpt)
                }
            })

        if (!first) this.show()
    }

    clear() { 
        this.itemWrap.classList.remove('hidden')
        this.currentItems.innerHTML = '' 
        this.curInd = 0
    }

    showActive() {
        this.currentItems.childNodes[this.curInd].className = "active-auto"
    }
    hideActive() {
        this.currentItems.childNodes[this.curInd].className = ""
    }

    select(item) {
        if (!item) return

        this.director.insert(this.id, item.firstChild.innerHTML, true)
        this.itemWrap.classList.add('hidden')

        this.director.update(this.id)
    }   
}

let filterIndex = {
    'major': "/data/majors-set.json",
    'city': "/data/cities-set.json",
    'university': "/data/unis-set.json"
}
let filterKeyIndex = {
    'majors': 2,
    'cities': 'name',
    'unis': 'name'
}
 // ^^ this -> can probably be done more cohesively lol
module.exports.default = (director, components, args) => 
    new autoCompeteInput(director, components, filterIndex[args.name])
