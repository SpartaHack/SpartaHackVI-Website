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
    return (now < info.exp) ? true : await newCreds(auth0)
}

let login = async auth0 => {
    let args = window.location.hash
    // window.location.hash = ""

    console.log('this is')
    if (window.localStorage.hasOwnProperty('stutoken') && 
        window.localStorage.hasOwnProperty('stuinfo')) return oldCreds(auth0)
    auth0.parseHash({hash: args}, (err, info) => {
        if (err || !info) return oldCreds()
        // ENVIRONMENT VARIABLE
        namespace = 'http://website.elephant.spartahack.com/'
        info.idTokenPayload['pt'] = info[namespace + 'pt']
        info.idTokenPayload['aid'] = info[namespace + 'aid']
        info.idTokenPayload['rsvp'] = info[namespace + 'rsvp']
        // ['pt']
        console.log('where')
        window.localStorage.setItem('stutoken', JSON.stringify(info)) // never do this in effectual contexts
        window.localStorage.setItem('stuinfo', JSON.stringify(info.idTokenPayload))

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
    window.location.hash = ""
    return true
}

// let signout = async 

module.exports.default = after => {
    let loginFuncs = after instanceof Function ? auth([login, after]) :
        after instanceof Array ? auth([login, ...after]) :
        [login]

    return auth(loginFuncs)
}
