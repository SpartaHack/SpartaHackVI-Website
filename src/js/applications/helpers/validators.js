const listValidator = require('./_stackInput').validate

let profile = value => {
    let lastHalf = value.match(/.+\/.+/)
    if (lastHalf) {
        value = (value.match(/\/.+/))[0].substr(1)
        input.parentNode.replaceChild(input, input)
    }

    let validPortion = value.match(/[a-zA-Z0-9\-\_]{3,99}\?\//)
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
    if (value.search(/(https?\:\/\/)?(www\.)?[\w\s\-\_]+\.\w{2,3}.+/) !== 0)
        return false

    if (value.search(/(https?\:\/\/)/) !== 0)
        return "https://" + value
    
    return value
}

// ---

const birthday = (value, outFields) => {
    console.log(value)
    let year, month, day,
    prependYear = base => (base.length == 2) ? 
        (Number(base.length) < 20 ? "20" : 19) + base
        : base

    if (value.search(/\d{1,2}[\-\/\s]\d{1,2}[\-\/\s]\d{2}(\d{2})?/) === 0) {
        year = Number(prependYear(value.match(/\d{2,4}$/)[0]))
        month = Number(value.substr(0, value.search(/[\-\/\s]/)))
        day = Number(value.match(/\-\d{2}/)[0].substr(1))
    }
    else if (value.search(/\d{4}\-\d{2}\-\d{2}/) === 0) {
        year = Number(value.substr(0,4))
        month = Number(value.substr(5,2))
        day = Number(value.substr(8,2))
    }
    else if (value.search(/[A-Za-z]{3,9}\s?\d{1,2}([A-Za-z]{2})?,?\s?\d{2}(\d{2})?/) === 0) {
        let months = {
            'january': 1,
            'february': 2,
            'march': 3,
            'april': 4,
            'may': 5,
            'june': 6,
            'july': 7,
            'august': 8,
            'september': 9,
            'october': 10,
            'november': 11,
            'december': 12
        },
        userMonth = value.substr(0,value.search(/\d/)-2)

        year = Number(prependYear(value.match(/\d{2,4}$/)[0]))
        month = months[userMonth]
        day = Number(value.match(/\d{1,2}/)[0])
    }

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day))
        return false

    let secYear = 3600 * 24 * 365
    secYear -= (secYear/365)/4 // for leap years
    let yearsOld = // epoch subtraction /1000 bc JS is weird
    Math.floor((new Date()-new Date(year,month,day))/1000/secYear),
    out = {}
    
    if (yearsOld > 12 && yearsOld < 120) {
        let vals = [year, month, day]
        for (let i = 0; i < 3; i++)
            out[outFields[i]] = vals[i]
        return out
    }
    return false
}

// ---
     
const statement = value =>
    value.split(" ").length >= 25 ? value : false

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
    if (!value.search(/(\d{1,3}(\-||\s))?\(?\d{3}\)?(\-||\s)?\d{3}(\-||\s)?\d{4}/) === 0)
        return false

    let from = value.match(/(^\d{1,3}|\d{4}$|\d{3})/g)
    return (!from || !from[0] || from.length > 4) 
        ? false : from.join("")
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
