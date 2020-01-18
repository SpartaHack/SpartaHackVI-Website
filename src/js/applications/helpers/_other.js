let fromList = components => {
    components.wrap.replaceChild(components.input, components.input2)
    delete components.input2
}

let typeOther = (director, id, components) => {
    let other = document.createElement('input')
    other.type = "text"
    other.id = components.input.id
    other.placeholder = "List: Backspace"

    other.addEventListener('keyup', e => {
        if (other.value.length === 0 && e.keyCode === 8)
            fromList(components)
    })

    other.addEventListener('change', 
        e => director.update(id, other) )

    components.input2 = other
    components.wrap.replaceChild(components.input2, components.input)
}

let ready = (director, components, args) => {
    components.input.addEventListener('change', () => {
        let selected = components.input
                      .childNodes[components.input.selectedIndex]

        if (selected.value === "other" || selected.value === "Other")
            typeOther(director, args.name, components)
    })

}

module.exports.default = ready
