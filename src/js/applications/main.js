import './../../scss/sheets/application.scss'
;(require('./../fa').default)()

const Director = require('./director').default,
Handler = require('./application').default,
getApiApp = require('./transactions').getApp

let validatorDictionaries = {
    'city': 'cities.json',
    'major': 'majors.json',
    'universities': 'unis.json'
},
handler,
handlerInit = async auth0 =>
    handler = new Handler(validatorDictionaries, auth0),
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
    let stuinfo = JSON.parse(window.localStorage.getItem('stuinfo')),
    localApp = JSON.parse(window.localStorage.getItem('oldApp')),
    auth = stuinfo["http://website.elephant.spartahack.com" + "/pt"],
    aid = stuinfo["http://website.elephant.spartahack.com" + "/aid"],
    getDirector = (old, fromAPI) => 
        director = new Director(directorArgs, handler, old, fromAPI)
    console.log('change url form')

    if (aid) {
        let oldApp = src => {
            if (src) getDirector(src, true)
            else {
                console.error("Couldn't get old app")
                getDirector(localApp)
            }
        }
        getApiApp(auth, aid, oldApp)
    }
    else {
        getDirector(localApp)
    }
}

;(require('../login').default)([handlerInit, directorInit])
