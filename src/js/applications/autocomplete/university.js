const uniList = require('./../../uni-list.json')
// source: https://github.com/Hipo/university-domains-list

module.exports.default = element => {
    let val = element.value.toLowerCase()
    let matching = []

    uniList.forEach(uni => {
        if (uni['name'].toLowerCase().indexOf(val) != -1)
            matching.push(uni['name'])
    })

    return matching
}