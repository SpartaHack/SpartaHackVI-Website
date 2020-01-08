const request = require('request')
require('../scss/components/sponsorship-list.scss')



let make = (info, container) => {
    if (!info) return

    let makeInd = sponsor => {
        let wrap = document.createElement('li')
        wrap.appendChild(document.createElement('a'))
        wrap.firstElementChild.href = sponsor.link //!!
        wrap.firstElementChild.target = '_blank'

        // let logo = document.createElement('img')
        // logo.onload = () => wrap.firstElementChild.appendChild(img)
        return wrap
    }

    let wrap = document.createElement('ul')
    info.forEach(
        i => wrap.appendChild(makeInd(i)))
    
    container.appendChild(wrap)
}

let get = target => {
    let sponsorsRq = {
        headers: {
            "Content-Type":"application/json",
            // "X-IMAGE-FORMAT": "SVG+XML"
        },
        url: window.location + "/data/sponsors.json",//"http://api.elephant.spartahack.com/sponsors",
        json: true
    }
    let getSponsors = (err, response, body) => {
        console.log(err, body)
        // cb(body)
        make(body, target)
    }
    request.get(sponsorsRq, getSponsors)
}

module.exports.default = container => {
    container = container instanceof HTMLElement ?
        container : document.createElement('section')
    
    get(container)

    container.id = container.id ? container.id : "sponsor-container"
    document.body.appendChild(container)
}