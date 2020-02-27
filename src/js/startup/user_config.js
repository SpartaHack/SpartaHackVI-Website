const auth0 = require('auth0-js').default.WebAuth,
transactions = require('./../transactions'),
env = require('./../../../env.json')

let auth_func = async cb => {
    let args = window.location.hash, 
    auth = await new auth0(env.auth),
    key = transactions.getKey()

    if (!args && !key) auth.authorize()

    else if (args && args.substr(0, 13).search(/token/) != -1) 
        auth.parseHash({}, (err, hashedInfo) => {
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

    else {
        let user = transactions.userIn()

        if ((user.exp - Math.floor(Date.now()/1000)) < 900)
            auth.authorize()

        cb(auth, user)
    }

    return auth
}

module.exports.default = auth_func
