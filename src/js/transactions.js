const req = require('./req'),
simpleCrypto = require("simple-crypto-js").default

let getKey = () => {
    let key = window.sessionStorage.getItem('st')
    return (key && key.search(/\w{5,6}\|/) === 0)
        ? key : false
},
decrypt = (src, asObject) => {
    let key = getKey(),
    item = window.localStorage.getItem(src)

    if (!item || !key) return

    let decryptor = new simpleCrypto(key), data
    
    try { data = decryptor.decrypt(item, asObject) }
    catch(err) { data = undefined }

    // console.log("-@ return @-", data, typeof data, src)
    return data
},
encrypt = (data, out) => {
    let key = getKey()
    if (!data || !out || !key) return
    
    let encryptor = new simpleCrypto(key)
    // console.log("!@ new @!", data, typeof data, out)
    data = encryptor.encrypt(data)
    
    window.localStorage.setItem(out, data)
    // console.log('!! encrypted !!', window.localStorage.getItem(out))
    return true
}

module.exports.encrypt = encrypt
module.exports.getKey = getKey

//
module.exports.setState = state => {
    state = Number(state)
    if (Number.isNaN(state) || Math.floor(state) !== state)
        return false

    window.localStorage.setItem('state', state)
    return state
}

module.exports.getState = 
    () => Number(window.localStorage.getItem(state))
// ---

module.exports.rsvpIn = api =>
    decrypt(api ? 'apiRsvp' : 'locRsvp', true)

module.exports.rsvpOut = (data, api) =>
    encrypt(data, api ? 'apiRsvp' : 'locRsvp')

// ---

module.exports.appIn = api =>
    decrypt(api ? 'apiApp' : 'locApp', true)

module.exports.appOut = (data, api) => {
        if (api === 1) {}
        else
            return encrypt(data, api ? 'apiApp' : 'locApp')
    }

// ---

module.exports.userIn = () => decrypt('user', true)

module.exports.userOut = data => encrypt(data, 'user')

// ---

let importCb = (which, cb, response, body) => {
    let contents = (response && response.statusCode === 200)
        ? body : false
    encrypt(contents, which)
    // console.log(response)
    if (contents)
        cb(body)
}

module.exports.getApp = (user, cb) => {
    let importRq = {
        headers: {
          "Content-Type": "application/json",
          "X-WWW-USER-TOKEN": user.pt
        },
        url: req.base+"/applications/"+user.aid,
        json: true
    },
    importApp = (err, response, body) =>
            importCb('apiApp', cb, response, body)

    req.uest.get(importRq, importApp)
}
// what
module.exports.getRsvp = (user, cb) => {
    let importRq = {
        headers: {
          "Content-Type": "application/json",
          "X-WWW-USER-TOKEN": user.pt
        },
        url: req.base+"/rsvps/"+user.pid,
        json: true
    },
    importRsvp = (err, response, body) =>
        importCb('apiRsvp', cb, response, body)

    req.uest.get(importRq, importRsvp)
}
