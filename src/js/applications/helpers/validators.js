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

// ---

let filterCheck = (value, filterSrc) => {
    let query = value.toLowerCase()
    let potRes
    let found

    if (Array.isArray(filterSrc) && filterSrc[0])
        for (let i = 0; i < filterSrc.length; i++) {
            potRes = filterSrc[i]

            if (potRes.toLowerCase() == query) {found = true; break}
            
        }
    return found ? potRes : false
}

const university = (value, handler) => 
    filterCheck(value, handler.getFilter('university'))


const city = (value, handler) => 
    filterCheck(value, handler.getFilter('city'))

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

const birthday = value => {
    let year = 3600 * 24 * 365
    year -= (year/365)/4 // for leap years
    let yearsOld = // epoch subtraction /1000 bc JS is weird
        Math.floor((new Date()-new Date(value))/1000/year)
    
    return (yearsOld > 12 && yearsOld < 120) ? ({
        'birth_year': value.substr(0,4),
        'birth_month': value.substr(5,2),
        'birth_day': value.substr(8,2),
    }) : false
}

// ---

const statement = value =>
    (value.search(/([a-zA-z]+[\s\,\&\(\)\[\]\/\\\-\.\?\!]{0,3}){25,}/) === 0)
    ? value : false

const name = value => 
    (value.search(/^[A-Za-zÀ-ÖØ-öø-ÿ]{1,50}\s[A-Za-zÀ-ÖØ-öø-ÿ]{1,50}/ ) === 0)
    ? value : false

const regWords = value => 
    (value.search(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{1,50}/ ) === 0)
    ? value : false

// ---

const phone = value => {
    if (value.search(/[0-9]{10,13}/) != -1)
        return value.length > 10 ? value : '01' + value
    
    let country = value.match(/^\+[0-9]{1,3}[^0-9]/)
    country = country ? 
        country[0].substr(0, country[0].length - 2) : '01'

    let findSections = str => str.match(/(?:^|[^\+])(\d{3})/gi)
    let findLastSection = str => str.match(/[0-9]{4}$/)
    let otherParts = findSections(value)
    let finalPart = findLastSection(value)

    if (!finalPart || otherParts.length != 3) 
        return false
    
    let phoneNumber = country + 
        (otherParts[0].length == 3 ? otherParts[0] : otherParts[0].substr(1)) + 
        otherParts[1].substr(1) + finalPart[0]

    let parsedString = new String(Number.parseInt(phoneNumber)),
        origLength = out[input.id].length    

    return (Number.parseInt(parsedString) == Number.parseInt(phoneNumber) &&
        origLength < 14 && origLength > 11)
        ? phoneNumber : false
}

// ---

module.exports.default = ({
    "github": profile,
    "devpost": profile,
    "linkedin": profile,
    "website": site,
    "personalStatement": statement,
    "name": name,
    "race": regWords,
    "gender": regWords,
    "birthday": birthday,
    "phone": phone,
    "city": city,
    "university": university
})