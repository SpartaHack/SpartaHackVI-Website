const request = require('request')
require('../scss/components/sponsorship-list.scss')

let get = cb => {
    let submitRq = {
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin": "http://api.elephant.spartahack.com",
            "Access-Control-Request-Method": "POST",
            // "X-WWW-USER-TOKEN": info[window.location.origin + "/pt"]
        },
        // body: { "application": app },
        url: "http://api.elephant.spartahack.com/sponsors",
        // json: true
    }
    let submitApp = (err, response, body) => {
        console.log(err, body)
        cb(body)
    }

    request.post(submitRq, submitApp)
}

let make = info => {
    let makeInd = sponsor => {
        let wrap = document.createElement('li')
        wrap.appendChild(docment.createElement('a'))
        wrap.firstElementChild.href = sponsor.link //!!
        wrap.firstElementChild.target = '_blank'

        let logo = document.createElement('img')
        logo.onload = () => wrap.firstElementChild.appendChild(img)
        return wrap
    }

    let wrap = document.createElement('ul')
    info.forEach(
        i => wrap.appendChild(makeInd(i)))

    return wrap
}

module.exports.default = container => {
    let noContainer = container === undefined ?
        document.createElement('section') : undefined
    
    get(make)

    if (noContainer) {
        noContainer.id = "sponsor-container"
        docment.body.appendChild('container')
    }
}