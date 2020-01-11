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
const makers = require('./helpers/_makers')
const special = {
    'autoComplete': require('./helpers/_autoComplete').default,
    'inlinelabel': () => {},
    'other': require('./helpers/_other').default,
    'list': require('./helpers/_listInput').default
}

const makerWrapping = (director, item, args) => {
    let components = {
        'input': item,
        'wrap': document.createElement('div'),
        'label': document.createElement('label'),
        'itemWwrap': document.createElement('li')
    }

    let isSpecial = false
    args.forEach(arg => {
        if (special[arg]) {
            special[arg](director, components, args)
            isSpecial = true
        }
    })

    if (!isSpecial) {
        components.wrap.appendChild(components.input)
        components.itemWwrap.appendChild(document.createElement('span'))
        components.itemWwrap.firstChild.appendChild(components.label)
        components.itemWwrap.appendChild(components.wrap)
    }

    return components
}
let makersRouting = (director, opts) => {
    if (typeof opts != "object" || !opts.input 
        || typeof opts.input == "string") return
    
    let args = opts.split("-")
    return makerWrapping(director, (
            args[-1] && makers[args[-1]] ? makers[args[-1]](args)
            : ( makers[args[0]] ? makers[args[0]](args) : undefined )
        ), args)
}
module.exports.item = makersRouting

let getPage = (pageName, src, handler) => {
    let page = document.createElement('section')
    page.id = pageName
    page.className = "form-section"

    let pageContent = document.createElement('ul')
    pageContent.id = "application-items"
    page.appendChild(pageContent)
    
    let postMeta = false
    src.forEach(si => {
        if (postMeta) {
            let inParts = makersRouting(handler, si)
            pageContent.appendChild(inParts.itemWwrap)
            handler.import(inParts)
        }
        else postMeta = true
    })
    return page
}
module.exports.page = getPage