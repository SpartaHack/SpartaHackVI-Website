let dictIndex = {
    'major': require('./../../data/majors-dict.json'),
    'travel-origin': require('./../../data/cities-dict.json'),
    'university': require('./../../data/unis-dict.json')
}
module.exports.fromDict = input => 
    dictIndex[input.id][input.value] ? true : false

module.exports.linkedin = input =>
     input.value.length > 3 && input.value.length < 100 
     && !re.search('^\w|\-', input.value)
     
module.exports.github = input => {
    return    
}
module.exports.devpost = input => {
    return    
}
module.exports.otherSite = input => {
    return
}