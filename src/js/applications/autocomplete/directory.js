let autoDOM = (element, options) => {
    console.log(options)
    // console.log(element)
}
let autoFuncs = {
    'travel-origin': require('./travelOrigin').default,
    'university': require('./university').default,
    'major': require('./major').default
}
module.exports.default = element => {
    let af = autoFuncs[element.id]
    
    if (af) element.addEventListener('keyup', 
        e => autoDOM(element, af(element)) )
}