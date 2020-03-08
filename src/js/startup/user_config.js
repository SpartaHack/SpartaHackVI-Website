const auth0 = require('auth0-js').default.WebAuth,
transactions = require('./../transactions'),
env = require('./../../../env.json')

let auth_func = async cb => {
    let args = window.location.hash, 
    auth = await new auth0(env.auth),
    key = transactions.getKey()

    if (!args && !key) {
        if (window.localStorage.getItem('triedAuth')) {
            window.localStorage.removeItem('triedAuth')
            window.location = "/"
        }
        else {
            window.localStorage.setItem('triedAuth', 'true')
            auth.authorize()
        }
    }

    else if (args && args.substr(0, 13).search(/token/) != -1) 
        auth.parseHash({}, (err, hashedInfo) => {
            if (hashedInfo) {
                let payload = hashedInfo.idTokenPayload,
                payloadNamespace = window.location.origin != "http://localhost:9000" 
                    ? window.location.origin : "http://website.elephant.spartahack.com",
                getUserItem = name => {
                    let locInPayload = payloadNamespace+"/"+name
                    
                    return payload.hasOwnProperty(locInPayload) 
                        ? payload[locInPayload] : false
                },
                userOut = {
                    'email': payload.email,
                    'name': payload.name != payload.email
                        ? payload.name : undefined,
                    'exp': payload.exp,
                    'picture': payload.picture,
                    'github': payload.sub.substr(0,6) == "github" 
                        ? payload.nickname : undefined
                },
                userItems = ['pt', 'aid', 'pid', 'rsvp']

                userItems.forEach(
                    i => userOut[i] = getUserItem(i) )    
                window.sessionStorage.setItem(
                    'st', getUserItem('lk') )

                transactions.userOut(userOut)
                history.replaceState(null, null, ' ')
                
                window.localStorage.removeItem('triedAuth')
                cb(auth, userOut)
            }
            else console.log(err)
        } )

    else {
        let user = transactions.userIn()
        if ((user.exp - Math.floor(Date.now()/1000)) < 900)
            auth.authorize()
            
        window.localStorage.removeItem('triedAuth')
        cb(auth, user)
    }

    return auth
}

module.exports.default = auth_func
