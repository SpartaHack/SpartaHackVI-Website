const auth = require('./auth_cofig').default,
transactions = require('./transactions')

let newCreds = async auth0 => {
    if (!auth0 || !auth0.authorize) 
        return
    await auth0.authorize()
    return true
},
oldCreds = async auth0 => {
    let user = transactions.userIn()
    if (!user) 
        return newCreds(auth0)

    let now = new Date()
    now = now.getTime()/1000
    return (now < user.payload.exp) 
        ? loggedIn(auth0) : newCreds(auth0)
},
login = async auth0 => {
    let args = window.location.hash
    if (args.search(/.{2}/) !== 0) 
        return oldCreds(auth0)
    
    auth0.parseHash({hash: args}, (err, hashedInfo) => {
        console.log(hashedInfo)
        if (err) return oldCreds()

        let getUserItem = name => 
            hashedInfo.idTokenPayload["http://website.elephant.spartahack.com"+"/"+name],
        userItems = ['pt', 'aid', 'rsvp'],
        userOut = {}

        userItems.forEach(
            i => userOut[i] = getUserItem(i) )
        userOut['payload'] = hashedInfo.idTokenPayload

        transactions.userOut(userOut)
    })
    return loggedIn(auth0)
},
loggedIn = auth0 => {
    let key = transactions.getKey(),
    bttn = document.getElementById('nav-logout')
    document.cookie = key

    window.location.hash = ""
    // console.log('l', document.cookie)
    // THIS REALLY NEEDS TO BE DONE PROPERLY @ SOME POINT
    if (!bttn) return
    bttn.addEventListener('click', e => logout(auth0))
    return true
},
logout = auth0 =>
    auth0.logout({returnTo: window.location.origin})

module.exports.default = async (after, args) => {
    let loginFuncs = after instanceof Function ? [login, after] :
        after instanceof Array ? [login, ...after] : [login]

    return await auth(loginFuncs, args)
}
