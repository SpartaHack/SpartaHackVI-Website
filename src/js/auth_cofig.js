const auth0 = require('auth0-js').default.WebAuth
const env = require('./../../env.json')

async function auth_func(cb, args) {
    let auth = new auth0(env.auth)

    if (Array.isArray(cb))
        cb.forEach(async f => await f(auth, args))
    
    else if (typeof cb == "function") await cb(auth, args)

    return true
}

export default auth_func
