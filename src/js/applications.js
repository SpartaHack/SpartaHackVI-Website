import '../scss/application.scss'
const Application = require('./appValidators/director').default

let app = new Application()
Array.from(document.getElementsByClassName('field-in')).forEach(fe => {
    fe.addEventListener('change', e => app.update(fe))
})