import './../../scss/sheets/nav.scss'
import './../../scss/sheets/application.scss'

const Application = require('./formHelpers/director').default
const autocomplete = require('./formHelpers/autocomplete').default

let app = new Application()

Array.from(document.getElementsByClassName('field-in'))
     .forEach(fe => app.import(fe))

// --- navigation

var current = 0
const sections = document.querySelectorAll('#app-wrap main section')
const buttons = {
    'p': document.querySelector('aside ul button:first-child'),
    'n': document.querySelector('aside ul button:nth-child(2)'),
    'd': document.querySelector('aside ul button:last-child')
}

let showCurrent = () => {
    for (var i = 0; i < sections.length; i++)
        sections[i].className = i == current ? 'app-section' : 'other-section'
}
let change = forward => {
    current += forward ? 1 : -1
    
    buttons.n.className = current == sections.length-1 
        ? 'other-section' : ''

    showCurrent(current, sections)
}

showCurrent()
buttons.n.addEventListener('click', () => change(true))
buttons.p.addEventListener('click', () => change(false))

buttons.d.addEventListener('click', () => app.submit())
