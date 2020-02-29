require('./../../scss/sheets/rsvp.scss')

const Director = require('../forms/director').default,
Handler = require('./../forms/handler').default,
reports = require('./reports').default,
submit = require('./submit').default,
transactions = require('./../transactions')

let user = transactions.userIn(),
handler,
rsvpCheck = (auth, user, state) => {
    if (state < 5) window.location = "/dashboard.html"
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
    'pageUrls': [ "/data/rsvp" ],
    'postSubmissionCb': domItems => {
        domItems.resume.itemWrap.parentNode.removeChild(domItems.resume.itemWrap)
        document.body.getElementById('invited-message').innerHTML = "You're set for SpartaHack VI!"
    }
},
director,
directorInit = (auth, user, state) => {
    let apiRsvp = transactions.rsvpIn(true)
    // console.log(apiRsvp)
    if (apiRsvp) {
        directorArgs['saveTo'] = 'apiRsvp'
        directorArgs['oldVals'] = apiRsvp
        directorArgs['readOnly'] = true
    }
    else {
        directorArgs.saveTo = 'locRsvp'
        directorArgs.oldVals = transactions.rsvpIn()
    }

    director = new Director(directorArgs, handler)        
}

;(require('./../startup/login').default)([rsvpCheck, handlerInit, directorInit])
