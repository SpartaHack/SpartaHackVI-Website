import './../../scss/sheets/application.scss'

const Director = require('./../forms/director').default,
Handler = require('./../forms/handler').default,
reports = require('./reports').default,
submit = require('./submit').default,
transactions = require('./../transactions')

;(require('./../fa').default)()

let handler,
handlerInit = (auth, user, state) =>
    handler = new Handler(auth, user, submit),
directorArgs = {
    'name': 'SpartaHack-VI-Hacker-Application',
    'reports': reports,
    'container': 'application-area',
    "buttons": {
        "next": document.getElementById('next-page'),
        "done": document.getElementById('finish-app'),
        "prev": document.getElementById('previous-page'),
    },
    'pageUrls': 
        [ "/data/p1",  "/data/p2",  "/data/p3" ]
},
director,
directorInit = (auth, user, state) => {
    let apiApp = transactions.appIn(true)
    if (apiApp) {
        directorArgs.saveTo = 'apiApp'
        directorArgs.oldVals = apiApp
        directorArgs.readOnly = true
    }
    else {
        directorArgs.saveTo = 'locApp'
        directorArgs.oldVals = transactions.appIn()
    }

    director = new Director(directorArgs, handler)
}

;(require('./../startup/login').default)([handlerInit, directorInit])
