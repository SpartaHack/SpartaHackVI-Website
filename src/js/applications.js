import '../scss/application.scss'
const valid = require('./appValidators/index')

let values = document.getElementsByClassName('field-in')
valid(values)