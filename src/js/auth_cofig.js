import createAuth0Client from '@auth0/auth0-spa-js'
import environment from './../../env.json'

async function auth_func (cb) {

    let auth = await createAuth0Client(environment.auth)
    
    if (Array.isArray(cb)) cb.forEach(func => func(auth))
    else cb(auth)
}

export default auth_func