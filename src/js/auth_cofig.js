const auth0 = require('auth0-js').default
const env = require('./../../env.json')

async function auth_func(cb) {
    let auth = new auth0.WebAuth(env.auth)

    if (Array.isArray(cb)) {        
        let doNext = at => {
            console.log(cb)
            if (at >= cb.length - 1) return
            
            doNext(++at, cb[at](auth))
        }
        doNext(0)
    }
    
    else if (typeof cb == "function") cb(auth)

    return true
}

export default auth_func
