const auth = require('./auth_cofig').default

let login = require('./login').default

let testing = async auth0 => {
    console.log(await auth0.getUser())
}

// auth(testing)

login(testing)