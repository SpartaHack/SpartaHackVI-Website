const text = require('./text')
const misc = require('./misc')

const validators = {
    'grad-season-opts': misc.select,
    'grad-year-opts': misc.select,
    'mlh-experience': misc.select,
    'travel-origin': text.travelOrigin,
    'gender-opts': misc.select,
    'university': text.university,
    'other-site': text.otherSite,
    'birthday': misc.birthday,
    'linkedin': text.linkedin,
    'devpost': text.devpost,
    'github': text.github,
    'major': text.major
}
let needed = Object.keys(validators)
let application = {}

module.exports = vals => {
    Array.from(vals).forEach(v => {
        let valid = validators[v.id]
        
        if (valid) valid(v, application)
    })
}
