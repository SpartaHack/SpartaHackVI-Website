require('./../../scss/sheets/rsvp.scss')

const Director = require('../forms/director').default,
Handler = require('./../forms/handler').default,
reports = require('./reports').default,
submit = require('./submit').default,
transactions = require('./../transactions')

let user = transactions.userIn(),
handler,
rsvpCheck = (auth, user, state) => {
    if (state < 4 || state == 7)
        window.location = "/dashboard.html"
},
handlerInit = (auth, user, state) =>
    handler = new Handler(auth, user, submit),
directorArgs = {
    'name': 'SpartaHack-VI-Hacker-RSVP',
    'reports': reports,
    'container': 'rsvp-area',
    'buttons': {
        'done': document.getElementById('submit-rsvp')
    },
    'pageUrls': [ "/data/rsvp" ]
},
director,
directorInit = (auth, user, state) => {
    let apiRsvp = transactions.appIn(true)
    console.log(apiRsvp)
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

;(require('./../startup/login').default)([rsvpCheck, handlerInit, directorInit])
