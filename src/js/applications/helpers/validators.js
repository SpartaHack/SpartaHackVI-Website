const listValidator = require('./_stackInput').validate

let profile = value => {
    let lastHalf = value.match(/.+\/.+/)
    if (lastHalf) {
        value = (value.match(/\/.+/))[0].substr(1)
        input.parentNode.replaceChild(input, input)
    }

    let validPortion = value.match(/[a-zA-Z0-9\-\_]{3,99}/)
    return (value.length > 3 && value.length < 100 
        && validPortion && validPortion[0] == value )
        ? value : false
}
let github = value => {
    let suffix = profile(value)
    return suffix ? "https://github.com/" + suffix : suffix
} 
let linkedin = value => {
    let suffix = profile(value)
    return suffix ? "https://www.linkedin.com/in/" + suffix : suffix
} 
let devpost = value => {
    let suffix = profile(value)
    return suffix ? "https://devpost.com/" + suffix : suffix
} 

// ---
// put into _autoComplete ?
let filterCheck = (value, filterSrc) => {
    if (!Array.isArray(filterSrc)) return
    let query = value.toLowerCase(),
    i = 0, potRes, found

    for (i; i < filterSrc.length; i++){
        potRes = filterSrc[i].toLowerCase()
        if (potRes == query) {
            found = value
            break
        }
    }
    return found ? true : false
}
// ^^
const major = (value, out, handler) => {
    let filter = handler.getFilter('major')
    return listValidator(value, 
        val => filterCheck(val, filter) )
        ? value : false
    }
const university = (value, out, handler) => {
    let filter = handler.getFilter('university')
    return filterCheck(value, filter)
}
const city = (value, out, handler) => {
    let filter = handler.getFilter('city')
    return filterCheck(value, filter)
}

// ---

const site = value => {
    let p0 = str => str.search(/^http?s\:\/\//)
    let p1 = str => str.search(/www\./)
    let p2 = str => str.search(/([\w|\d|\-|\_]{3,}\.){1,5}\w{1,3}\/?(.+)$/)
    // definitely could have better regex for url contents

    let domainStart = p2(value)
    let urlStart = p1(value)
    domainStart += !domainStart && domainStart == urlStart ? 4 : 0

    if (domainStart == 0 && urlStart) 
        value = 'https://' + value
    else if (p2 < 3) return
    else if (
        (urlStart == 0 && domainStart != 4) ||
        (p0(value) == 0 && 
        (urlStart != 7 && urlStart != 8))
    ) return
    else value = 'https://' + value.substr(domainStart)

    return value
}

// ---

const birthday = (value, outFields) => {
    let year = 3600 * 24 * 365
    year -= (year/365)/4 // for leap years
    let yearsOld = // epoch subtraction /1000 bc JS is weird
        Math.floor((new Date()-new Date(value))/1000/year),
    out = {}
    
    if (yearsOld > 12 && yearsOld < 120) {
        let vals = [
            Number(value.substr(8,2)),
            Number(value.substr(0,4)),
            Number(value.substr(5,2))
        ]
        for (let i = 0; i < 3; i++)
            out[outFields[i]] = vals[i]
        return out
    }
    return false
}

// ---

const statement = value =>
    (value.search(/([a-zA-z\s]+[\s\,\&\(\)\[\]\/\\\-\.\?\!]{0,3}){25,}/) === 0)
    ? value : false

const name = (value, outFields) => {
    if (value.search(/^[A-Za-zÀ-ÖØ-öø-ÿ]+\s[A-Za-zÀ-ÖØ-öø-ÿ]+/ ) != 0)
        return

    let nameParts = value.split(' '),
    out = {}

    for (let i = 0; i < 2; i++)
        out[outFields[i]] = nameParts[i]
    return out
}

const regWords = value => (value.search(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{1,50}/ ) === 0)
    ? value : false

const race = value =>
    listValidator(value, val => val)
// ---

const phone = value => {
    if (!value.search(/(\d{1,3}(\-||\s)?)?\(?\d{3}\)?(\-||\s)?\d{3}(\-||\s)?\d{4}/) === 0)
        return false
    let from = value.match(/((\d{4}$)|(\d{3}))/g)
    let phone = (from[0] + from[1] + from[2])
    console.log(phone, from)
    return phone
}

// ---

module.exports.default = ({
    "github": github,
    "devpost": devpost,
    "linkedin": linkedin,
    "website": site,
    "personalStatement": statement,
    "name": name,
    "race": race,
    "gender": regWords,
    "birthday": birthday,
    "phone": phone,
    "city": city,
    "major": major,
    "university": university,
    "gradYear": yr => Number(yr)
})
