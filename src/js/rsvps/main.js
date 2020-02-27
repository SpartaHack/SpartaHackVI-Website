import './../../scss/sheets/rsvp.scss'

const Director = require('./../applications/director').default,
Handler = require('./../applications/application').default,
transactions = require('./../transactions'),
submit = require('./rsvpSubmit').default

let user = transactions.userIn(),
handler,
handlerInit = async auth0 =>
    handler = new Handler(auth0, user, submit),
directorArgs = {
    'container': 'rsvp-area',
    'urls': [ window.location.origin + "/data/rsvp" ],
    'buttons': {'done': document.getElementById('submit-rsvp')}
},
director,
directorInit = async auth0 => {
    let apiApp = transactions.appIn(true),
    getDirector = (old, fromAPI) => {
        console.log(fromAPI)
        if (!fromAPI) {
            old = old ? old : {}
        }
        director = new Director(directorArgs, handler, old, -1)
    }
    
    if (user.rsvp && !apiApp) 
        transactions.getRsvp(user.pt, user.aid, src => {
            if (src) getDirector(src, true)
            else 
                console.error("Couldn't get submitted app")
        })
    else if (apiApp)
        getDirector(transactions.appIn(true), true)
    else
        getDirector(transactions.appIn())

        
}, 
rsvpCheck = async auth0 => {
    let apiApp = transactions.appIn(true),
    redirect = () => window.location = "/dashboard.html",
    check = apiApp => {
        console.log(apiApp)
        if (apiApp.status != "accepted")
            redirect()
    },
    after = () => ([handlerInit, directorInit]).forEach(f => f(auth0))
    console.log(apiApp)

    if (!user.aid) redirect()
    else if (user.rsvp)
        transactions.getRsvp(user.pid, user.rsvp, rsvp => {
            console.log(rsvp)
            after()
        })
    else if (!apiApp)
    transactions.getApp(user.pt, user.aid, 
        src => redirect(src) )
    else if (apiApp) after()
    else redirect(apiApp)

    rsvpCheck 
}

;(require('../login').default)(rsvpCheck)
