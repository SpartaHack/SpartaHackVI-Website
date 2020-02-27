const auth = require('./auth_cofig').default,
eventState = require('./eventState').default

let login = async cb => {
    cb = Array.isArray(cb) ? cb : [cb]

    let after = (auth, user) =>
        eventState(state => 
            cb.forEach(func => func(auth, user, state)) )

    await auth(after)
    return
}
module.exports.default = login
