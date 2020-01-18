let request = require('request')

class autoCompeteInput {
    constructor(filterSrc, components) {
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
        if (this.components.wrap.lastChild === this.itemWrap)
            this.components.wrap.removeChild(this.itemWrap)

        let show = () => {
            this.show()

            this.components.wrap.removeEventListener('focus', show)
            this.components.wrap.removeEventListener('mouseenter', show)
        }

        this.components.input.addEventListener('focus', show)
        this.components.wrap.addEventListener('mouseenter', show)
    }

    show() {
        if (!this.currentItems.childElementCount) 
            this.hide()

        else if (this.components.wrap.lastChild.className === 'autocomplete-list')
            this.components.wrap.replaceChild(this.itemWrap, this.components.wrap.lastChild)

        else this.components.wrap.appendChild(this.itemWrap)

        let hide = () => {
            this.hide()

            this.components.wrap.removeEventListener('blur', hide)
            this.components.wrap.removeEventListener('mouseleave', hide)
        }

        this.components.wrap.addEventListener('blur', hide)
        this.components.wrap.addEventListener('mouseleave', hide)
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

        let updated = this.components.input
        updated.value = item.firstChild.innerHTML

        this.components.wrap.replaceChild(updated, this.components.input)
        this.components.input = updated

        if (this.components.wrap.lastChild === this.itemWrap)
            this.components.wrap.removeChild(this.itemWrap)
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

let ready = (appHandler, components, args) => {
    let dictRq = {
        headers: 
            { "Content-Type":"application/json" },
        url: window.location.origin + filterIndex[args.name],
        json: true
    }

    let dictCb = (err, response, body) => {
        let autoCompleteHandler
        if (response && response.statusCode === 200 
            && Array.isArray(body) ) 
            autoCompleteHandler = new autoCompeteInput(body, components)
    }

    let dictInit = e => {
        request.get(dictRq, dictCb)
        components.input.removeEventListener('focus', dictInit)
    }
    components.input.addEventListener('focus', dictInit)
}


module.exports.default = ready
