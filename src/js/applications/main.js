import './../../scss/application.scss'
const Application = require('./validators/director').default
const autocomplete = require('./autocomplete/directory').default

let app = new Application()

Array.from(document.getElementsByClassName('field-in')).forEach(fe => {
    fe.addEventListener('change', e => app.update(fe))
    autocomplete(fe)
})

