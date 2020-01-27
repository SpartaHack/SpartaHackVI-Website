// const auth0 = require('auth0-js').default.WebAuth
const env = require('./../../env.json')

async function auth_func(cb) {
    let auth = new auth0.WebAuth(env.auth)

    if (Array.isArray(cb))
        cb.forEach(async f => await f(auth))
    
    else if (typeof cb == "function") await cb(auth)

    return true
}

export default auth_func
