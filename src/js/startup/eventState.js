const transactions = require('./../transactions')

startCheck = async cb => {
    let user = transactions.userIn(),
    existing = {
        'apiRsvp': transactions.rsvpIn(true),
        'rsvp': transactions.rsvpIn(),
        'apiApp': transactions.appIn(true),
        'app': transactions.appIn()
    }, 
    state = s => transactions.setState(s), thisState

    console.log(user, existing)
    if (existing.apiRsvp)
        thisState = 6
    else if (user.rsvp)
        transactions.getRsvp(user, () => startCheck(cb))
    else if (existing.rsvp)
        thisState = window.localStorage.getItem('locRsvpDone')
            ? 8 : 5
    else if (existing.apiApp) {
        if (existing.apiApp.status == "Accepted")
            thisState = 5
        else if (existing.apiApp.status == "Rejected")
            thisState = 4
        else if (existing.apiApp.status == "Applied")
            thisState = 3
    }
    else if (user.aid)
        transactions.getApp(user, () => startCheck(cb))
    else if (existing.app)
        thisState = 1
    else
        thisState = 0

    console.log("---", state)
    if (thisState !== undefined)
        cb(state(thisState))
}

module.exports.default = startCheck
