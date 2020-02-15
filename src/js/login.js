const auth = require('./auth_cofig').default,
transactions = require('./transactions')

let newCreds = async auth0 => {
    // if (!auth0 || !auth0.authorize) 
    //     return
    await auth0.authorize()
    return true
},
oldCreds = async auth0 => {
    let user = transactions.userIn()
    console.log(user)
    if (!user) 
        return newCreds(auth0)

    let now = new Date()
    now = now.getTime()/1000
    return (now < user.exp) 
        ? loggedIn(auth0) : newCreds(auth0)
},
login = async auth0 => {
    let args = window.location.hash

    auth0.parseHash({hash: args}, (err, hashedInfo) => {
        if (err || !hashedInfo) return oldCreds(auth0)
        else {
            window.localStorage.removeItem('locApp')
            window.localStorage.removeItem('apiApp')
            window.localStorage.removeItem('user')
        }
        let payload = hashedInfo.idTokenPayload,
        getUserItem = name => 
            payload["https://spartahack.com"+"/"+name],
        userItems = ['pt', 'aid', 'rsvp'],
        userOut = {
            'email': payload.email,
            'name': payload.name != payload.email
                ? payload.name : undefined,
            'exp': payload.exp,
            'picture': payload.picture
        }

        if (payload.sub.substr(0,6) == "github") {
            userOut.name = payload.first_name+" "+payload.last_name
            userOut.github = payload.nickname
        }
        

        userItems.forEach(
            i => userOut[i] = getUserItem(i) )
        transactions.userOut(userOut)
    })
    return loggedIn(auth0)
},
loggedIn = auth0 => {
    let key = transactions.getKey(),
    bttn = document.getElementById('nav-logout')
    window.sessionStorage.setItem('st', key)
    if (!bttn) return
    bttn.addEventListener('click', e => logout(auth0))
    return true
},
logout = auth0 => {
    auth0.logout({returnTo: window.location.origin})
    window.localStorage.removeItem('user')
}

module.exports.default = async (after, args) => {
    let urlClear = async () => history.replaceState(null, null, ' '),
    loginFuncs = after instanceof Function ? [login, after, urlClear] :
        after instanceof Array ? [login, ...after, urlClear] : [login, urlClear]
    
    return await auth(loginFuncs, args)
}
