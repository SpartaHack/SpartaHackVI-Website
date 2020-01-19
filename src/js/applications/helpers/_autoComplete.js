let request = require('request')

class autoCompeteInput {
    constructor(filterSrc, components, director) {
        this.director = director
        this.components = components
        this.filterSrc = filterSrc
        this.curInd = 0

        this.itemWrap = document.createElement('span')
        this.itemWrap.className = 'autocomplete-list'
        this.currentItems = document.createElement('ul')
        this.itemWrap.append(this.currentItems)
        
        this.components.input.addEventListener('keyup', e => this.route(e.keyCode))
    }

    hide() {
        if (this.components.inputWrap.lastChild === this.itemWrap)
            this.components.inputWrap.removeChild(this.itemWrap)

        let show = () => {
            this.show()

            this.components.inputWrap.removeEventListener('focus', show)
            this.components.inputWrap.removeEventListener('mouseenter', show)
        }

        this.components.input.addEventListener('focus', show)
        this.components.inputWrap.addEventListener('mouseenter', show)
    }

    show() {
        if (!this.currentItems.childElementCount) 
            this.hide()

        else if (this.components.inputWrap.lastChild.className === 'autocomplete-list')
            this.components.inputWrap.replaceChild(this.itemWrap, this.components.inputWrap.lastChild)

        else this.components.inputWrap.appendChild(this.itemWrap)

        let hide = () => {
            this.hide()

            this.components.inputWrap.removeEventListener('blur', hide)
            this.components.inputWrap.removeEventListener('mouseleave', hide)
        }

        this.components.inputWrap.addEventListener('blur', hide)
        this.components.inputWrap.addEventListener('mouseleave', hide)
    }

    set currentIndex(val) {
        let current = this.currentItems.childNodes[this.curInd]
        if (current) current.className = ''

        let curCount = this.currentItems.childElementCount    
        val = (!Number.isInteger(val) || val >= curCount) ? 0 :
            (val < 0 ? curCount - 1 : val)
    
        this.currentItems.childNodes[val].className = 'active-auto'
        this.curInd = val
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

    clear() { this.currentItems.innerHTML = '' }

    showActive() {
        this.currentItems.childNodes[this.curInd].className = "active-auto"
    }
    hideActive() {
        this.currentItems.childNodes[this.curInd].className = ""
    }

    select(item) {
        if (!item) return
        
        let value = item.firstChild.innerHTML,
            updated = this.components.input
        updated.value = value

        this.components.inputWrap.replaceChild(updated, this.components.input)
        this.components.input = updated
        this.director.handler.validate(this.components.input.id, value)

        if (this.components.inputWrap.lastChild === this.itemWrap)
            this.components.inputWrap.removeChild(this.itemWrap)
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

let ready = (director, components, args) => {
    let dictRq = {
        headers: 
            { "Content-Type":"application/json" },
        url: window.location.origin + filterIndex[args.name],
        json: true
    }
    console.log(director)
    let dictCb = (err, response, body) => {
        let autoCompleteHandler
        if (response && response.statusCode === 200 && Array.isArray(body) ) {
            autoCompleteHandler = new autoCompeteInput(body, components, director)
            director.handler.importFilter(args.name, body)
        }
    }

    let dictInit = e => {
        request.get(dictRq, dictCb)
        components.input.removeEventListener('focus', dictInit)
    }
    components.input.addEventListener('focus', dictInit)
}


module.exports.default = ready
