let autoDOM = (element, options) => {
    console.log(element)
}
let autoFuncs = {
    'travel-origin': require('./travelOrigin'),
    'university': require('./university'),
    'major': require('./major')
}
module.exports.default = element => {
    let af = autoFuncs[element.id]
    if (af) element.addEventListener('keyup', 
        e => autoDOM(element, af(element.value)) )
}