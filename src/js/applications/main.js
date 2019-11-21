import './../../scss/sheets/nav.scss'
import './../../scss/sheets/application.scss'

const Application = require('./formHelpers/director').default
let app = new Application()

// --- navigation

var current = Number(localStorage.getItem('pos'))
current = current === NaN ? 0 : current

const sections = document.querySelectorAll('#app-wrap main section')
const buttons = {
    'p': document.querySelector('aside ul button:first-child'),
    'n': document.querySelector('aside ul button:nth-child(2)'),
    'd': document.querySelector('aside ul button:last-child')
}

let showCurrent = () => {
    buttons.p.className = current == 0 ?
        'other-section' : ''
    buttons.n.className = current == sections.length - 1 ?
        'other-section' : ''

    for (var i = 0; i < sections.length; i++)
        sections[i].className = i == current ? 'app-section' : 'other-section'
}
let change = forward => {
    current += forward ? 1 : -1
    localStorage.setItem('pos', current)
    
    showCurrent(current, sections)
}

showCurrent()
buttons.n.addEventListener('click', () => change(true))
buttons.p.addEventListener('click', () => change(false))

buttons.d.addEventListener('click', () => app.submit())
