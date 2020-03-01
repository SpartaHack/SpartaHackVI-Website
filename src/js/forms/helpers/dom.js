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
const makers = require('./makers'),
special = {
    'other': require('./_other').default,
    'list': require('./_stackInput').default,
    'autocomplete': require('./_autoComplete').default,
    'opt': require('./_noValidation').default
},
readOnlySpecial = {
    'list': require('./_stackNavigation').default,
    'other': special.other
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

    // if (item.type == "text" && args.placeholder)
        // { item.placeholder = args.placeholder }
    // ^^ oops

    if (args.labelVis && args.labelVis === "inline"){
        components.itemWrap.classList.add('inline-label')
        components.inputWrap.prepend(components.label)
    }
    else components.itemWrap.appendChild(components.label)

    if (args.labelVis && args.labelVis === "hidden")
        { components.itemWrap.classList.add('hidden-label') }
    
    
    components.itemWrap.appendChild(components.inputWrap)
    let specialHandlers = {},
    handlerLocation = director.readOnly ? readOnlySpecial : special

    args.input.forEach(arg => {
        if (handlerLocation[arg])
            specialHandlers[arg] = handlerLocation[arg](director, components, args)
    })
    
    if (Object.keys(specialHandlers)[0]) {
        components['specialHandlers'] = specialHandlers
        components.itemWrap.appendChild(components.controlWrap)
    }
    return components
},
makersRouting = (director, opts) => {
    if (!opts || !opts.input) return
    
    opts.input = opts.input.split("-")
    
    let type = opts.input.pop(),
    mkrs = director.fromApi ? makers.readOnly : makers.default
    return makerWrapping(director, mkrs[type](opts), opts)
},
getPage = (pageName, src, director) => {
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
            // console.log(inParts, si)
            director.import(inParts, si)
        }
    })
    return page
}
module.exports.page = getPage
module.exports.item = makersRouting