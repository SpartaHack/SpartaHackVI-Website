const text = require('./text')
const misc = require('./misc')

class Application {
    constructor() {
        this.validators = {
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
        this.autocomplete = {
            'travel-origin': text.travelOrigin,
            'university': text.university,
            'major': text.major
        }
        this.needed = {
            'grad-season-opts': true,
            'grad-year-opts': true,
            'mlh-experience': true,
            'travel-origin': true,
            'gender-opts': true,
            'university': true,
            'other-site': true,
            'birthday': true,
            'linkedin': true,
            'devpost': true,
            'github': true,
            'major': true
        }
        this.out = {}
    }

    update(src) {
        let field = src.id
        let func = this.validators[field]
        if (!func) return undefined;

        let result
        let worked = func(src, result)

        if (worked) {
            this.out[field] = result
            this.needed[field] = false
        }
        else {
            delete this.out[field]
            this.needed[field] = true
        }

        return this.needed[field]
    }

    export(out) {
        if (typeof out != Object) return undefined

        let stillNeeded = []
        let complete = true

        Object.keys(this.needed).forEach(n => {
            if (this.needed[n]) {
                complete = false
                stillNeeded.push(n)
            }
            else out[n] = this.out[n]
        })

        return complete ? stillNeeded : false
    }
}

module.exports.default = Application
