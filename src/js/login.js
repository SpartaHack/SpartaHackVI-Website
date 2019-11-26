const auth = require('./auth_cofig').default

let login = async auth0 => {
    let args = window.location.toString()
    let userCode = args.match(/code\=.+(?=\&)/)
    let appState = args.match(/state\=.+/)

    if (userCode && userCode.length == 1)        
        try {
            await auth0.handleRedirectCallback()
            let token = await auth0.getIdTokenClaims()
            console.log(await auth0.getUser())
            return true
        } catch (error) {
            console.log('failed', auth0)
            return false
        }
    else {
        let test = await auth0.isAuthenticated()
        console.log(test)
    }

    
}
module.exports.default = after => {
    if (after instanceof Function)
        auth([login, after])
    else if (after instanceof Array)
        auth([login, ...after])
}