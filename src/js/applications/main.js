import './../../scss/sheets/application.scss'
;(require('./../fa').default)()

const Director = require('./director').default,
Handler = require('./application').default,
transactions = require('./../transactions')

let validatorDicts = {
    'city': 'cities.json',
    'major': 'majors.json',
    'universities': 'unis.json'
},
handler,
handlerInit = (auth, user, state) =>
    handler = new Handler(auth, user, validatorDicts),
directorArgs = {
    'container': 'application-area',
    'urls': [
        window.location.origin + "/data/p1", 
        window.location.origin + "/data/p2", 
        window.location.origin + "/data/p3"
    ]
},
director,
directorInit = (auth, user, state) => {
    let apiApp = transactions.appIn(true),
    args = apiApp ? [apiApp, true] : [transactions.appIn, false]

    director = new Director(directorArgs, handler, args[0], args[1])        
}

;(require('./../startup/login').default)([handlerInit, directorInit])
