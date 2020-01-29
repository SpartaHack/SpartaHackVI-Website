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
const makers = require('./helpers/makers')
const special = {
    'other': require('./helpers/_other').default,
    'list': require('./helpers/_stackInput').default,
    'autocomplete': require('./helpers/_autoComplete').default,
    'opt': require('./helpers/_noValidation').default
}

const makerWrapping = (director, item, args) => {
    if (!item) return

    let components = {
        'input': item,
        'label': document.createElement('label'),
        'itemWrap': document.createElement('li'),
        'inputWrap': document.createElement('div'),
        'controlWrap': document.createElement('span'),
    }

    components.input.id = args.name
    components.input.autocomplete = "off"
    components.inputWrap.id = args.name + "Wrap"
    components.inputWrap.className = "input-wrap"
    components.inputWrap.tabIndex = -1
    components.inputWrap.appendChild(components.input)
    
    components.controlWrap.className = "input-controls"
    components.label.for = args.name
    components.label.innerHTML = args.label
    components.itemWrap.className = 
        "field-container " + (args.class ? args.class : '')

    if (item.type == "text" && args.placeholder)
        { item.placeholder = args.placeholder }

    if (args.labelVis && args.labelVis === "inline"){
        components.itemWrap.classList.add('inline-label')
        components.inputWrap.prepend(components.label)
    }
    else components.itemWrap.appendChild(components.label)

    if (args.labelVis && args.labelVis === "hidden")
        { components.itemWrap.classList.add('hidden-label') }
    
    
    components.itemWrap.appendChild(components.inputWrap)
    if (!director.fromApi)
        components.itemWrap.appendChild(components.controlWrap)

    let specialHandlers = {}
    args.input.forEach(arg => {
        if (special[arg])
            specialHandlers[arg] = special[arg](director, components, args)
    })
    if (Object.keys(specialHandlers)[0]) 
        components['specialHandlers'] = specialHandlers
    return components
}
let makersRouting = (director, opts) => {
    if (!opts || !opts.input) return
    
    opts.input = opts.input.split("-")
    console.log(director, director.fromApi)
    
    let type = opts.input.pop(),
    mkrs = director.fromApi ? makers.readOnly : makers.default
    return makerWrapping(director, mkrs[type](opts), opts)
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