const auth0 = require('auth0-js').default.WebAuth,
transactions = require('./transactions'),
env = require('./../../env.json')

async function auth_func(cb) {
    let args = window.location.hash, 
    auth = await new auth0(env.auth),
    key = transactions.getKey()

    if (!args && !key) auth.authorize()

    else if (args) auth.parseHash({}, (err, hashedInfo) => {
        console.log(err, hashedInfo)
        // if (err || !hashedInfo) auth.authorize()

        let payload = hashedInfo.idTokenPayload,
        getUserItem = name => 
            payload[window.location.origin+"/"+name],
        userItems = ['pt', 'aid', 'rsvp'],
        userOut = {
            'email': payload.email,
            'oaid': payload.sub,
            'name': payload.name != payload.email
                ? payload.name : undefined,
            'exp': payload.exp,
            'picture': payload.picture,
            'github': payload.sub.substr(0,6) == "github" 
                ? payload.nickname : undefined
        }

        userItems.forEach(
            i => userOut[i] = getUserItem(i) )

        window.sessionStorage.setItem('st',
            transactions.getKey() )

        transactions.userOut(userOut)
        history.replaceState(null, null, ' ')

        cb(auth, userOut)
    } )
    else cb(auth, transactions.userIn())
}

export default auth_func
