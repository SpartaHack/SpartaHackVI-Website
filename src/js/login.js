const auth = require('./auth_cofig').default

let newCreds = auth0 => {
    if (!auth0 || !auth0.authorize) return

    auth0.authorize()

    return true
}
let oldCreds = auth0 => {
    let creds = JSON.parse(window.localStorage.getItem('stutoken'))
    let info = JSON.parse(window.localStorage.getItem('stuinfo'))

    if (!creds || !info) return newCreds(auth0)

    let now = new Date(); now = now.getTime()/1000

    return (now < info.exp) ? true : newCreds(auth0)
}

let callHomme = auth0 => {
    
}

let login = async auth0 => {
    let args = window.location.hash
    window.location.hash = ""

    if (args.search(/access\_token/) == -1) return oldCreds(auth0)
    
    auth0.parseHash({hash: args}, (err, info) => {
        if (err || !info) return oldCreds()

        window.localStorage.setItem('stutoken', JSON.stringify(info)) // never do this in effectual contexts
        window.localStorage.setItem('stuinfo', JSON.stringify(info.idTokenPayload))
    })    
}

module.exports.default = after => {
    if (after instanceof Function)
        auth([login, after])
    else if (after instanceof Array)
        auth([login, ...after])
        
}