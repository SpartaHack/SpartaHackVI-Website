module.exports.major = (val, mi) =>
    mi[1].toLowerCase().indexOf(val) == -1 ? false : mi[1]

module.exports.travel = (val, ti) =>
    ti['name'].toLowerCase().indexOf(val) == -1 ? false : ti['name']

module.exports.university = (val, ui) =>
    ui['name'].toLowerCase().indexOf(val) == -1 ? false : ui['name']
