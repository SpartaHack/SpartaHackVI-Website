const auth0 = require('auth0-js').default
const env = require('./../../env.json')

async function auth_func(cb) {
    let auth = new auth0.WebAuth(env.auth)
    
    if (Array.isArray(cb)) 
        cb.forEach(async func => await func(auth))
    else await cb(auth)

    return
}

export default auth_func
