import './../../scss/sheets/application.scss'
;(require('./../fa').default)()

const Director = require('./../forms/director').default,
Handler = require('./../forms/handler').default,
reports = require('./reports').default,
submit = require('./submit').default,
transactions = require('./../transactions')

let handler,
handlerInit = (auth, user, state) =>
    handler = new Handler(auth, user, submit),
directorArgs = {
    'name': 'SpartaHack-VI-Hacker-Application',
    'reports': reports,
    'container': 'application-area',
    "buttons": {
        "done": document.getElementById('done'),
        "prev": document.getElementById('prev'),
        "next": document.getElementById('next')
    },
    'urls': 
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
