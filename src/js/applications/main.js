import './../../scss/sheets/nav.scss'
import './../../scss/sheets/application.scss'


const Application = require('./validators/director').default
const autocomplete = require('./validators/autocomplete').default

let app = new Application()

Array.from(document.getElementsByClassName('field-in')).forEach(fe => {
    fe.addEventListener('blur', e => app.update(fe))
    autocomplete(fe)
})

let showCurrent = (current, sections) => {
    for (var i = 0; i < sections.length; i++)
        sections[i].className = i == current ? '' : 'other-section';
}

var current = 0
var sections = document.querySelectorAll('#app-wrap main section')
showCurrent(current, sections)
