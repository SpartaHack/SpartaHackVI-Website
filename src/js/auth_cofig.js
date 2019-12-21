const auth0 = require('auth0-js').default
const env = require('./../../env.json')

async function auth_func(cb) {
    let auth = new auth0.WebAuth(env.auth)
    
    if (Array.isArray(cb))
        cb.forEach(async func => 
            {if (typeof func == "function") await func(auth) } )
    
    else if (typeof cb == "function") cb(auth)
    
    let bttn = document.getElementById('nav-logout')
    if (!bttn) return
    bttn.addEventListener('click', 
        e => auth.logout({returnTo: "http://website.elephant.spartahack.com/"}))

    return true
}

export default auth_func
