import './../../scss/application.scss'
const Application = require('./validators/director').default
const autocomplete = require('./validators/autocomplete').default

let app = new Application()

Array.from(document.getElementsByClassName('field-in')).forEach(fe => {
    fe.addEventListener('blur', e => app.update(fe))
    autocomplete(fe)
})