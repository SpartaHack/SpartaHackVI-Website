import './../../scss/sheets/application.scss'
;(require('./../fa').default)()

const Director = require('./director').default,
Handler = require('./application').default,
transactions = require('./../transactions')

let user = transactions.userIn(),
validatorDicts = {
    'city': 'cities.json',
    'major': 'majors.json',
    'universities': 'unis.json'
},
handler,
handlerInit = async auth0 =>
    handler = new Handler(auth0, user, validatorDicts),
directorArgs = {
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
},
director,
directorInit = async auth0 => {
    let apiApp = transactions.appIn(true),
    getDirector = (old, fromAPI) => {
        if (!fromAPI) {
            old = old ? old : {}
            if (user.github) 
                old.github = old.github ? old.github : user.github
            if (user.name) 
                old.name = old.name ? old.name : user.name
        }
        director = new Director(directorArgs, handler, old, fromAPI)
    }
    
    if (user.aid && !apiApp) 
        transactions.getApp(user.pt, user.aid, src => {
            if (src) getDirector(src, true)
            else 
                console.error("Couldn't get submitted app")
        })
    else if (apiApp)
        getDirector(transactions.appIn(true), true)
    else
        getDirector(transactions.appIn())
}

;(require('../login').default)([handlerInit, directorInit])
