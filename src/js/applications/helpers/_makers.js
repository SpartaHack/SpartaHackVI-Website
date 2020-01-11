const text = args =>{
    let displayType

    args.forEach(arg => {
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

    return input
}

const select = args => {
    let input = document.createElement('select')
    return input
}

const date = args => {
    let input = document.createElement('input')
    input.type = "date"
    return input
}

const number = args => {
    let input = document.createElement('input')
    input.type = "number"

    return input
}

module.exports.default = ({
    "text": text,
    "select": select,
    "date": date,
    "number": number
})