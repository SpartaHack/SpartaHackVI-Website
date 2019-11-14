import '../scss/application.scss'
const validationDirector = require('./appValidators/director')

validationDirector(
    document.getElementsByClassName('field-in'))