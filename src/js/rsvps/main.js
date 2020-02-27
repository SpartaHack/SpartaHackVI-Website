import './../../scss/sheets/rsvp.scss'

const Director = require('../forms/director').default,
Handler = require('./../forms/handler').default,
reports = require('./reports').default,
submit = require('./submit').default,
transactions = require('./../transactions')

let user = transactions.userIn(),
handler,
handlerInit = async auth0 =>
    handler = new Handler(auth0, user, submit),
directorArgs = {
    'name': 'SpartaHack-VI-Hacker-RSVP',
    'reports': reports,
    'container': 'rsvp-area',
    'buttons': {
        'done': document.getElementById('submit-rsvp')
    },
    'urls': [ "/data/rsvp" ]
},
director,
directorInit = async auth0 => {
    let apiRsvp = transactions.appIn(true)
    if (apiRsvp) {
        directorArgs.saveTo = 'apiRsvp'
        directorArgs.oldVals = apiRsvp
        directorArgs.readOnly = true
    }
    else {
        directorArgs.saveTo = 'locRsvp'
        directorArgs.oldVals = transactions.rsvpIn()
    }

    director = new Director(directorArgs, handler)        
}

;(require('./../startup/login').default)([handlerInit, directorInit])
