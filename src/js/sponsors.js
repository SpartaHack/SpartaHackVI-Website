const request = require('request')
require('../scss/components/sponsorship-list.scss')

let get = cb => {
    let submitRq = {
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin": "http://api.elephant.spartahack.com",
        },
        url: "http://api.elephant.spartahack.com/sponsors",
        json: true
    }
    let submitApp = (err, response, body) => {
        console.log(err, body)

        if (body) cb(body)
    }

    request.get(submitRq, submitApp)
}

let make = info => {
    let makeInd = sponsor => {
        let wrap = document.createElement('li')
        wrap.appendChild(document.createElement('a'))
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
    container = container instanceof HTMLLIElement ?
        container : document.createElement('section')
    
    get(make)

    container.id = container.id ? container.id : "sponsor-container"
    document.body.appendChild(container)
}