let filter = (element, src, filter) => {
    let val = element.value.toLowerCase()
    let matching = new Set()

    src.forEach(si => {
        if (filter(val, si)) matching.add(si)
    })

    return Array.from(matching).sort()
}
let filters = {
    "major": (val, mi) =>
    mi[1].toLowerCase().indexOf(val) == -1 ? false : true,

    "travel": (val, ti) =>
        ti['name'].toLowerCase().indexOf(val) == -1 ? false : true,

    "university": (val, ui) =>
        ui['name'].toLowerCase().indexOf(val) == -1 ? false : true
}
let filterIndex = {
    'major': [filters.major, require('./../../major-list.json')],
    'travel-origin': [filters.travel, require('./../../cities-list.json')],
    'university': [filters.university, require('./../../uni-list.json')]
}

let autoDOM = (element, options) => {
    let wrap = element.parentNode
    if (wrap.lastChild.nodeName == "UL")
        wrap.removeChild(wrap.lastChild)

    if (element.value.length < 3) return 

    let suggestArea = document.createElement('ul')
    suggestArea.class = "autoCompleteArea"
    suggestArea.id = element.id+"-"+suggestArea.className
    
    options.forEach(opt => {
        let optElem = document.createElement('li')
        optElem.className = 'autoOpt'

        let val = opt['name'] ? opt['name'] : opt[1]
        optElem.innerHTML = val
        optElem.dataset.val = val

        suggestArea.appendChild(optElem)
    })
    wrap.appendChild(suggestArea)
}

module.exports.default = element => {
    let auto = filterIndex[element.id]
    
    if (auto) element.addEventListener('keyup', 
        e => autoDOM(element, filter(element, auto[1], auto[0])) )
}

