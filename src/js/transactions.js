const req = require('./req'),
simpleCrypto = require("simple-crypto-js").default

module.exports.getApp = (auth, aid, cb) => {
    let importRq = {
        headers: {
          "Content-Type": "application/json",
          "X-WWW-USER-TOKEN": auth
        },
        url: req.base+"/applications/"+aid,
        json: true
    },
    importApp = (err, response, body) => {
        console.log(body)
        if (response && response.statusCode === 200)
            cb(body)
        else cb()
    }
    
    req.uest.get(importRq, importApp)
}

module.exports.getRsvp = (user, cb) => {
    let importRq = {
        headers: {
          "Content-Type": "application/json",
          "X-WWW-USER-TOKEN": user.pt
        },
        // body: {email: user.email},
        url: req.base+"/rsvps/"+user.oaid,
        json: true
    },
    importRsvp = (err, response, body) => {
        console.log(body)
        if (response && response.statusCode === 200)
            cb(body)
        else cb()
    }
    // console.log(importRq)
    req.uest.get(importRq, importRsvp)
}

let getKey = key => {
    if (key) return key
    key = window.location.hash

    if (key.search(/id_token/) != -1) {
        key = key.charAt(13) == "=" ?
            key.split('&').pop().substr(9,25)
            : key.substr(1)
        
        return "!!--"+key
    }

    key = window.sessionStorage.getItem('st')
    return (key && key.substr(0,4) == "!!--" )
        ? key : false
},
decrypt = src => {
    let key = getKey(),
    item = window.localStorage.getItem(src)

    if (!item || !key) return

    let decryptor = new simpleCrypto(key),
    data = decryptor.decrypt(item)

    return JSON.parse(data)
},
encrypt = (data, out) => {
    let key = getKey()
    if (!data || !out || !key) return
    
    let encryptor = new simpleCrypto(key)
    data = encryptor.encrypt(JSON.stringify(data))

    window.localStorage.setItem(out, data)
    return true
}

module.exports.getKey = getKey

module.exports.appIn = api =>
    decrypt(api ? 'apiApp' : 'locApp')

module.exports.appOut = (data, api) => {
        if (api === 1) {}
        else
            return encrypt(data, api ? 'apiApp' : 'locApp')
    }

module.exports.userIn = () => decrypt('user')

module.exports.userOut = data => encrypt(data, 'user')
