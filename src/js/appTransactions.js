const request = require('request') 

module.exports.getApp = (info, current) => {
    // let importRq = {
    //     headers: {
    //       "Content-Type":"application/json",
    //     //   "Access-Control-Allow-Origin": "http://api.elephant.spartahack.com/",
    //       "X-WWW-USER-TOKEN": info.sub
    //     },
    //     url: "http://api.elephant.spartahack.com/sessions/" + appId,
    //     json: true
    // }

    // let importApp = (err, response, body) => {
    //     if (response && response.statusCode === 200) {
    //         console.log(body)
    //     }
    // }

    // request.post(importRq, importApp)
    console.log("tried to get application")
}

module.exports.sendApp = (app, info) => {
    let submitRq = {
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin": "http://api.elephant.spartahack.com",
            "Access-Control-Request-Method": "POST",
            "X-WWW-USER-TOKEN": window.location.host + "/pt"
        },
        body: { "application": app },
        url: "http://api.elephant.spartahack.com/applications",
        json: true
    }

    let submitApp = (err, response, body) => {
        console.log(err, body)
    }

    request.post(submitRq, submitApp)
}