import createAuth0Client from '@auth0/auth0-spa-js'
import auth from './../../auth.json'

async function auth_func (cb) {
    let auth0 = await createAuth0Client(auth)

    if (Array.isArray(cb)) cb.forEach(func => func(auth0))

    else cb(auth0)
}

export default auth_func