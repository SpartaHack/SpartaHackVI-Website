module.exports.fromDict = (input, out) => true

module.exports.linkedin = (input, out) =>
     input.value.length > 3 && input.value.length < 100 
     && !re.search('^\w|\-', input.value)
     
module.exports.github = (input, out) => {
    return    
}
module.exports.devpost = (input, out) => {
    return    
}

module.exports.otherSite = (input, out) => {

}


module.exports.select = (input, out) => {
    out[src.dataset.out] = src.value
}
    
module.exports.birthday = (input, out) =>{


    if (true) {
        dest['birth_year'] = src.value.substr(0,4)
        dest['birth_month'] = src.value.substr(5,2)
        dest['birth_day'] = src.value.substr(8,2)
    }

    return true
}