const uniList = require('./../../uni-list.json')

module.exports.default = element => {
    let val = element.value.toLowerCase()
    let matching = []

    // console.log(uniList)
    uniList.forEach(uni => {
        if (uni['name'].toLowerCase().indexOf(val) != -1)
            matching.push(uni['name'])
    })

    return matching
}