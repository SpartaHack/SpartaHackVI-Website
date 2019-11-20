const dicts = {
    'major': require('./../../data/majors-dict.json'),
    'travel-origin': require('./../../data/cities-dict.json'),
    'university': require('./../../data/unis-dict.json')
}
module.exports.fromDict = (input, out) => {
    if (!input.value) return undefined
    
    if (input.value in dicts[input.id]) 
        out[input.id] = input.value
    
    else return false
    return true
}

// ---

module.exports.linkedin = (input, out) => {
    if (!input.value) return undefined

    if (
        input.value.length > 3 && input.value.length < 100 
        && !input.value.search(/^\w|\-/)
    ) out[input.id] = input.value

    else return false
    return true
}

// ---

let githubDevpost = (input, out) => {
    if (!input.value) return undefined

    if (
        input.value.length > 3 && input.value.length < 100 
        && !input.value.search(/^\w|\-|\_/)
    ) out[input.id] = input.value
    
    else return false
    return true  
}
module.exports.github = githubDevpost
module.exports.devpost = githubDevpost

// ---

module.exports.otherSite = (input, out) => {
    if (!input.value) return undefined

    let p0 = str => str.search(/^http?s\:\/\//)
    let p1 = str => str.search(/www\./)
    let p2 = str => str.search(/((\w|\d|\-|\_)+\.){1,5}\w{3}\/.+$/)
    // definitely could have better regex for url contents

    let val = input.value
    let domainStart = p2(val)

    if (domainStart == 0) val = 'https://' + val

    else if (p2 < 3) return false

    else {
        let urlStart = p1(val)

        if (
            (urlStart == 0 && domainStart != 4) ||
            (p0(val) == 0 && 
            (urlStart != 7 && urlStart != 8))
        ) return false

        val = 'https://' + val.substr(domainStart)
    }

    out[input.id] = val
    return true
}

// ---

module.exports.select = (input, out) => {
    if (input.selectedIndex == 0) return undefined

    
    let possibleValues = []
    Array.from(input.querySelectorAll('option')).forEach(
        p => possibleValues.push(p.value) )
    
    out[input.id] = possibleValues[input.selectedIndex]
    return true
}

// ---

module.exports.birthday = (input, out) =>{
    if (!input.value) return false

    let year = 3600 * 24 * 365
    year -= (year/365)/4 // for leap years
    let yearsOld = // epoch subtraction /1000 bc JS is weird
        Math.floor((new Date()-new Date(input.value))/1000/year)

        console.log(yearsOld)
    if (yearsOld > 12 && yearsOld < 120) {
        out['birth_year'] = input.value.substr(0,4)
        out['birth_month'] = input.value.substr(5,2)
        out['birth_day'] = input.value.substr(8,2)
    }
    
    else return false
    return true
}