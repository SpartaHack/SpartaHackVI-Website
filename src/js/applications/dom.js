/*
"name": {
    "input": 
        "text" (*) || "select" (^) || "date" (%) || "number" (#) ||
        --* "autocomplete-"
        --# "other-"
        ----*# list
        ------* "-paragraph--" || ""
        ------* ""

    ,inputOpts: {
        *: 
        ^:
        %: 
        #: min, max, 
    }
    ,placeholder: ""
    ,error: ""
    ,validator: "" || bool
    ,out: "" || ["field1", "field2"]
}
*/
const makers = require('./helpers/_makers').default
const special = {
    'autocomplete': require('./helpers/_autoComplete').default,
    'inlinelabel': () => {},
    'other': require('./helpers/_other').default,
    'list': require('./helpers/_listInput').default
}

const makerWrapping = (director, item, args) => {
    if (!item) return

    let components = {
        'input': item,
        'wrap': document.createElement('div'),
        'label': document.createElement('label'),
        'itemWrap': document.createElement('li')
    }
    components.input.id = args.name
    components.input.autocomplete = "off"
    components.wrap.id = args.name + "Wrap"
    components.wrap.tabIndex = -1
    components.label.for = args.name
    components.label.innerHTML = args.label
    components.itemWrap.className = 
        "field-container " + (args.class ? args.class : '')
    if (item.type == "text" && args.placeholder)
        item.placeholder = args.placeholder

    let exclusive
    args.input.forEach(arg => {
        if (special[arg]) exlusive = 
            special[arg](director, components, args) === true 
                ? true : false
    })

    if (!exclusive) {
        if (args.labelVis && args.labelVis === "inline"){
            components.itemWrap.classList.add('inline-label')
            components.wrap.appendChild(components.label)
        }
        else components.itemWrap.appendChild(components.label)
        
        components.wrap.appendChild(components.input)
        components.itemWrap.appendChild(components.wrap)
    }
    // components.input.addEventListener('change', e => director)
    if (args.labelVis && args.labelVis === "hidden")
        components.itemWrap.classList.add('hidden-label')
    
    return components
}
let makersRouting = (director, opts) => {
    if (!opts || !opts.input) return
    
    opts.input = opts.input.split("-")
    // opts.oldVal = director.getOldVal(opts.name)

    let inputType = opts.input.pop()
    return makerWrapping(director, makers[inputType](opts), opts)
}
module.exports.item = makersRouting

let getPage = (pageName, src, director) => {
    let page = document.createElement('section')
    page.id = pageName
    page.className = "app-section"

    let pageContent = document.createElement('ul')
    pageContent.id = "application-items"
    page.appendChild(pageContent)
    
    src.forEach(si => {
        let inParts = makersRouting(director, si)

        if (inParts) {
            pageContent.appendChild(inParts.itemWrap)
            director.import(inParts, si)
        }
    })
    return page
}
module.exports.page = getPage