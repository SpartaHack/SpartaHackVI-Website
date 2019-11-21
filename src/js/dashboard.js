const auth = require('./auth_cofig').default

async function testing(auth0) {
    const isAuthenticated = await auth0.isAuthenticated();
    console.log(isAuthenticated)
}

auth(testing)

