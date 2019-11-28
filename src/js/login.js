const auth = require('./auth_cofig').default

let login = async auth0 => {
    let args = window.location.toString()
    let userCode = args.match(/code\=.+(?=\&)/)

    if (userCode && userCode.length == 1)        
        try {
            await auth0.handleRedirectCallback()
            let info = await auth0.getIdTokenClaims()
            let token = await auth0.getTokenSilently()

            window.localStorage.setItem('info', JSON.stringify(info))
            window.localStorage.setItem('token', token)
            console.log(window.localStorage.getItem('info'), 'init succ')
            
            return true
        } catch (error) {
            console.log(window.localStorage.getItem('info'), 'arg err')
            return false
        }
    else {
        // let t = await auth0.getTokenWithPopup()
        await auth0.checkSession()
        let t = await auth0.getTokenSilently()
        console.log(await auth0.isAuthenticated())
        
    }

    
}
module.exports.default = after => {
    if (after instanceof Function)
        auth([login, after])
    else if (after instanceof Array)
        auth([login, ...after])
}