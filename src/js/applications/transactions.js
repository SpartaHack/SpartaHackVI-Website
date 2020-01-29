const request = require('request')

module.exports.getApp = (auth, aid, cb) => {
    let importRq = {
        headers: {
          "Content-Type":"application/json",
          "X-WWW-USER-TOKEN": auth
        },
        url: "http://api.elephant.spartahack.com/applications/" + aid,
        json: true
    },
    importApp = (err, response, body) => {
        console.log(body)
        if (response && response.statusCode === 200)
            cb(body)
        else cb()
    }
    
    request.get(importRq, importApp)
}
