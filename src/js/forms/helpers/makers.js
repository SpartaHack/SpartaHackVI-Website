const text = args => {
    let displayType
    args.input.forEach(arg => {
        switch (arg) {
            case "list": 
            break;
            case "paragraph":
            case "inlineLabel":
                   displayType = arg
        }
    })

    let input
    if (displayType === "paragraph")
        input = document.createElement('textarea')
    else {
        input = document.createElement('input')
        input.type = 'text'
    }

    if (args.placeholder)
        input.placeholder = args.placeholder

    return input
}

const select = args => {
    let input = document.createElement('select'),
    opt = (val, txt) => {
        let opt = document.createElement('option')
        opt.value = val
        opt.innerText = txt
        return opt
    }
    
    if (args.placeholder !== undefined) {
        let placeholder = opt("", args.placeholder)
        placeholder.disabled = true
        placeholder.selected = true
        placeholder.hidden = true
        input.appendChild(placeholder)
    }

    if (Array.isArray(args.options))
        args.options.forEach(o => input.appendChild(opt(o, o)))
    else if (args && args.options)
        Object.keys(args.options).forEach(optVal => 
            input.appendChild(opt(optVal, args.options[optVal])) )
    else return false
    
    return input
}

const date = args => {
    let input = document.createElement('input')
    input.type = "date"
    input.placeholder = "mm/dd/yyyy"
    return input
}

const number = args => {
    let input = document.createElement('input')
    input.type = "number"
    input.min = args.min
    input.value = args.default ? args.default : 0
    return input
}

const file = args => {
    let input = document.createElement('input')
    input.type = "file"
    if (args.accept)
        input.accept = args.accept

    return input
}

const check = args => {
    let input = document.createElement('input')
    input.type = "checkbox"
    input.className = "form-check"
    return input
}
const rdOnly = input => {
    input.readOnly = true
    return input
}

let makers = {
    "text": text,
    "select": select,
    "date": date,
    "number": number,
    "check": check,
    "file": file
},
readOnly = {}

Object.keys(makers).forEach(k => 
    readOnly[k] = args => rdOnly(makers[k](args)) )

module.exports.default = makers
module.exports.readOnly = readOnly
