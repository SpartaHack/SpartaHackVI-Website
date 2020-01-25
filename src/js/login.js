const auth = require('./auth_cofig').default

let newCreds = async auth0 => {
    if (!auth0 || !auth0.authorize) return
    await auth0.authorize()
    return true
}

let oldCreds = async auth0 => {
    let creds = JSON.parse(window.localStorage.getItem('stutoken'))
    let info = JSON.parse(window.localStorage.getItem('stuinfo'))

    if (!creds || !info) return newCreds(auth0)

    let now = new Date(); now = now.getTime()/1000
    return (now < info.exp) ? loggedIn(auth0) : await newCreds(auth0)
}

let login = async auth0 => {
    console.log('hello?')
    let args = window.location.hash
    if (!args.search(/access\_token/)) return oldCreds(auth0)
    console.log('still here')
    auth0.parseHash({hash: args}, (err, info) => {
        if (err || !info) return oldCreds()

        let getUserItem = name => info.hasOwnProperty(window.location.origin+"/"+name) ? 
            info[window.location.origin+"/"+name] : false

        let userItems = ['pt', 'aid', 'rsvp']
        userItems.forEach(
            i => info.idTokenPayload[i] = getUserItem(i) )
            
        window.localStorage.setItem('stutoken', JSON.stringify(info)) // never do this in effectual contexts
        window.localStorage.setItem('stuinfo', JSON.stringify(info.idTokenPayload))

        console.log(info, window.localStorage)

        if ( (!info.idTokenPayload.name || info.idTokenPayload.name.search(/\@/) !== -1) 
            && !info.idTokenPayload.family_name ) return

        let out = window.localStorage.hasOwnProperty('out') ? 
            JSON.parse(window.localStorage.getItem('out')) : {}
        if (!out) out = {}
        
        out['name'] = out['name'] ? out['name'] 
            : info.idTokenPayload.name ? info.idTokenPayload.name 
            : (info.idTokenPayload.family_name && info.idTokenPayload.given_name) ?
                info.idTokenPayload.given_name + ' ' + info.idTokenPayload.family_name
            : null
        
        if (out.name) 
            window.localStorage.setItem('application', JSON.stringify(out))
    })

    
    return loggedIn(auth0)
}
let logout = auth0 => {
    if (window.localStorage.hasOwnProperty('stutoken'))
        window.localStorage.removeItem('stutoken')
    if (window.localStorage.hasOwnProperty('stuinfo'))
        window.localStorage.removeItem('stuinfo')

    auth0.logout({returnTo: window.location.origin})

}
let loggedIn = auth0 => {
    window.location.hash = ""
    
    let bttn = document.getElementById('nav-logout')
    if (!bttn) return

    bttn.addEventListener('click', e => logout(auth0))

    return true
}

module.exports.default = after => {
    let loginFuncs = after instanceof Function ? [login, after] :
        after instanceof Array ? [login, ...after] : [login]

    console.log(loginFuncs)
    return auth(loginFuncs)
}
