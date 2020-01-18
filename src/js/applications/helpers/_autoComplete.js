let request = require('request')
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

let getDict = (which, cb) => {
    console.log(which, 'cool')
    let dictRq = {
        headers: 
            { "Content-Type":"application/json" },
        url: window.location.origin + filterIndex[which],
        json: true
    }

    let dictCb = (err, response, body) => {
        let autoCompleteHandler
        if (response && response.statusCode === 200 
            && Array.isArray(body) ) 
            autoCompleteHandler = cb(body)
    }

    request.get(dictRq, dictCb)
}

// Creates our auto suggest unordered list/wrap
let filter = (filterSrc, cmpFnc, components) => {
    if (!Array.isArray(filterSrc)) return
    else if (!cmpFnc || !components 
        || components.input.value.length < 3) return false

    let listWrap = document.createElement('span')
    listWrap.className = 'autocomplete-list'

    let list = document.createElement('ul')
    listWrap.appendChild(list)
    
    filterSrc.forEach(target => {
        let result = cmpFnc(target) 
        if (result) { // update list
            let thisOpt = document.createElement('li')
            thisOpt.addEventListener('click', 
                e => selectItem(thisOpt, components))
            thisOpt.innerHTML = "<p>" + result + "</p>"
            list.appendChild(thisOpt)

        }
    })
        
    return startDom(listWrap, components)
}   

class autoCompeteInput {
    constructor(filterSrc, components) {
        this.components = components
        this.filterSrc = fiterSrc

        this.curInd
        this.itemWrap = document.createElement('span')
        this.itemWrap.className = 'autocomplete-area'
        this.currentItems = document.createElement('ul')

        this.components.input.addEventListener('keyup', 
            e => this.route(e.keyCode) )

        let hide = () => this.hide()
        let show = () => this.show()
        this.components.wrap.addEventListener('blur', hide)
        this.components.wrap.addEventListener('mouseleave', hide)
        this.components.wrap.addEventListener('mouseenter', show)
        this.components.input.addEventListener('focus', show)
    }

    hide() {
        if (this.components.wrap.lastChild === this.itemWrap)
            this.components.wrap.removeChild(this.itemWrap)
    }

    show() {
        if (!this.currentItems.childElementCount) 
            this.hide()

        else if (this.components.wrap.lastChild.className === 'autocomplete-area')
            this.components.wrap.replaceChild(this.itemWrap, this.components.wrap.lastChild)

        else this.components.wrap.appendChild(this.itemWrap)
    }

    get current() {
        this.currentItems.childElementCount > this.currentItems 
            ? this.currentItems.childNodes[this.currentIndex] : undefined
    }

    set currentIndex(val) {
        val = val > this.currentItems.childElementCount ? 0 :
            (val < 0 ? this.currentItems.childElementCount - 1 : val)
        
        this.currentItems.childNodes[this.curInd] = ''
        this.curInd = val
        this.currentItems.childNodes[val].className = 'active'
    }

    route(keycode) {
        switch (keycode) {
            case 40: this.currentIndex = this.curInd + 1
            break
            case 38: this.currentIndex = this.curInd - 1
            break
            case 13: this.select(this.current)
        }
    }

    filter() {

    }
}

let ready = (appHandler, components, args) => {
    let wrapper = options => new autoCompeteInput(options, components)

    let dictInit = e => {
        getDict(args.name, wrapper )
        components.input.removeEventListener('focus', dictInit)
    }
    components.input.addEventListener('focus', dictInit)
}


module.exports.default = ready
