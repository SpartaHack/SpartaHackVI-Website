import './../../scss/sheets/application.scss'

;(require('../login').default)()

const Director = require('./director').default
const Handler = require('./application').default

let validatorDictionaries = {
    'city': 'cities.json',
    'major': 'majors.json',
    'universities': 'unis.json'
}
let handler = new Handler(validatorDictionaries)

let directorArgs = {
    'container': 'application-area',
    'buttons': {
        'prev': document.querySelector('aside ul button:first-child'),
        'next': document.querySelector('aside ul button:nth-child(2)'),
        'done': document.querySelector('aside ul button:last-child')
    },
    'urls': [
        window.location.origin + "/data/p1", 
        window.location.origin + "/data/p2", 
        window.location.origin + "/data/p3"
    ]
}
let director = new Director(directorArgs, handler)
director.setPage()
