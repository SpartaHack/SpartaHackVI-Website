const auth = require('./auth_cofig').default

let testing = async auth0=> {
    console.log(auth0)
}

auth(testing)

