const request = require('request'),
simpleCrypto = require("simple-crypto-js").default

module.exports.getApp = (auth, aid, cb) => {
    let importRq = {
        headers: {
          "Content-Type":"application/json",
          "X-WWW-USER-TOKEN": auth
        },
        url: "http://api.spartahack.com/applications/" + aid,
        json: true
    },
    importApp = (err, response, body) => {
        if (response && response.statusCode === 200)
            cb(body)
        else cb()
    }
    
    request.get(importRq, importApp)
}

let getKey = key => {
    if (key) return key
    key = window.location.hash

    if (key.search(/id_token/) != -1) {
        key = key.charAt(13) == "=" ?
            key.split('&').pop().substr(9,25)
            : key.substr(1)
        
        return "!!--"+key
    } // I'm sure theres a better way, but I'm dead rn
    key = document.cookie.split(";")
    for (let i = 0; i < key.length; i++) {
        if (key[i].substr(0,4) == "!!--")
        return key[i]
    }
    return false
    console.error('not logged in')
    // return val
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

module.exports.appOut = (data, api) =>
    encrypt(data, api ? 'apiApp' : 'locApp')

module.exports.userIn = () => decrypt('user')

module.exports.userOut = data => encrypt(data, 'user')
