let filterIndex = {
    'major': require('./../../data/majors-set.json'),
    'travel_origin': require('./../../data/cities-set.json'),
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

// Creates our auto suggest unordered list/wrap
let autoDOM = (element, options, director) => {
    let wrap = element.parentNode
    if (wrap.lastChild.id == "autocomplete-wrap")
        wrap.removeChild(wrap.lastChild)

    if (element.value.length < 3) return 

    let suggestArea = document.createElement('ul')
    suggestArea.class = "autoCompleteArea"
    suggestArea.id = element.id+"-"+suggestArea.className
    
    options.forEach(opt => {
        let optElem = document.createElement('li')
        optElem.className = 'autoOpt'

        optElem.innerHTML = opt
        optElem.dataset.val = opt

        optElem.addEventListener('click', 
            () => autoDone(element, optElem.dataset.val, director))
        suggestArea.appendChild(optElem)
    })

    let suggestWrap = document.createElement('div')
    suggestWrap.id = "autocomplete-wrap"
    suggestWrap.appendChild(suggestArea)
    
    element.addEventListener('blur', 
        e => wrap.removeChild(suggestWrap))
    wrap.appendChild(suggestWrap)
}


// Handles keyboard navigation within our unordered list/wrap
let autoData = (element, keycode) => {
    let options = element.parentNode.lastChild
    if (options.id != 'autocomplete-wrap') return false
    options = options.firstChild

    let selected = options.querySelector('.active-auto')
    let active

    if (!selected) active = keycode == 38 ?
        options.lastChild : options.firstChild
    else {
        selected.classList.remove('active-auto')

        if (keycode == 40) { // down key
            if (selected == options.lastChild) active = options.firstChild
            else active = selected.nextSibling
        }   
        else if (keycode == 38 ) { // up key
            if (active == options.firstChild) active = options.lastChild
            else active = selected.previousSibling
        }
    }
    active.classList.add('active-auto')
    active.scrollIntoView()

    return true
}

let autoDone = (element, val, director) => {
    val = val ? val :
        element.parentNode.lastChild.querySelector('.active-auto').dataset.val
    if (!val) return
    
    element.value = val
    let autocompleted = element
    
    element.parentNode.replaceChild(element, autocompleted)
    element.parentNode.dataset.value = val
    element.parentNode.removeChild(element.parentNode.lastChild)

    element.blur()
    director.update(autocompleted)
}

module.exports.default = (element, director) => {
    let autoSrc = filterIndex[element.id]

    if (autoSrc) element.addEventListener('keyup', e => {
        if (e.keyCode == 38 || e.keyCode == 40)
            autoData(element, e.keyCode)
        else if (e.keyCode == 13) 
            autoDone(element, false, director)       
        else
            autoDOM(element, filter(element, autoSrc), director)
    })
}
