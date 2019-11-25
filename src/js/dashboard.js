const auth = require('./auth_cofig').default

let testing = async auth0=> {
    let f = await auth0.handleRedirectCallback()
    let y = await auth0.getUser()
    console.log(y)

    // console.log(auth0)
}

auth(testing)

