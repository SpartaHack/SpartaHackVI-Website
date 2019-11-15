const cityList= require('./../../cities-list.json')

module.exports.default = element => {
    let val = element.value.toLowerCase()
    let matching = new Set()

    cityList.forEach(ci => {
        if (ci['name'].toLowerCase().indexOf(val) != -1)
            matching.add(ci['name'])
    })

    return Array.from(matching).sort()
}