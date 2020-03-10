const authConfig = require('./user_config').default,
eventState = require('./eventState').default

let login = async cb => {
    cb = Array.isArray(cb) ? cb : [cb]

    let after = (auth, user) =>
        eventState(state => 
            cb.forEach(func => func(auth, user, state)) ),
    auth = await authConfig(after),
    
    logoutButton = document.getElementById('nav-logout')
    if (logoutButton) {
        console.log(logoutButton)
        let event = e => {
            window.sessionStorage.removeItem('st')
            auth.logout({ returnTo: window.location.origin })
        }
        logoutButton.addEventListener('click', event)
    }
    
    return
}


module.exports.default = login
