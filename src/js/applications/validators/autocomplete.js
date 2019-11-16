let filterIndex = {
    'major': require('./../../data/majors-set.json'),
    'travel-origin': require('./../../data/cities-set.json'),
    'university': require('./../../data/unis-set.json')
}

let filter = (element, src) => {
    let val = element.value.toLowerCase()
    let matching = new Set()

    src.forEach(cmpVal => {        
        if (cmpVal.toLowerCase().indexOf(val) != -1) 
            matching.add(cmpVal)
    })

    return Array.from(matching).sort()
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

        // let val = opt['name'] ? opt['name'] : opt[1]
        optElem.innerHTML = opt
        optElem.dataset.val = opt

        suggestArea.appendChild(optElem)
    })
    wrap.appendChild(suggestArea)
}

module.exports.default = element => {
    let autoSrc = filterIndex[element.id]
    
    if (autoSrc) element.addEventListener('keyup', 
        e => autoDOM(element, filter(element, autoSrc)) )
}

