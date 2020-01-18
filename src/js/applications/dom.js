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

const makerWrapping = (handler, item, args) => {
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
        console.log(arg)
        if (special[arg]) exlusive = 
            special[arg](handler, components, args) === true 
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
let makersRouting = (handler, opts) => {
    if (!opts || !opts.input) return
    opts.input = opts.input.split("-")

    let inputType = opts.input.pop()
    // console.log(inputType)
    // opts.input.push(inputType)
    return makerWrapping(handler, makers[inputType](opts), opts)
}
module.exports.item = makersRouting

let getPage = (pageName, src, handler) => {
    let page = document.createElement('section')
    page.id = pageName
    page.className = "app-section"

    let pageContent = document.createElement('ul')
    pageContent.id = "application-items"
    page.appendChild(pageContent)
    
    src.forEach(si => {
        let inParts = makersRouting(handler, si)

        if (inParts) {
            pageContent.appendChild(inParts.itemWrap)
            handler.import(inParts)

        }
        // console.log(si, inParts)
    })
    return page
}
module.exports.page = getPage