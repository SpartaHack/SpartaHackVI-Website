const majorList = require('./../../major-list.json')
// source: https://github.com/fivethirtyeight/data/tree/master/college-majors

module.exports.default = element => {
    let val = element.value.toLowerCase()
    let matching = []

    majorList.forEach(mi => {
        if (mi[1].toLowerCase().indexOf(val) != -1)
            matching.push(mi[1])
    })

    return matching
}