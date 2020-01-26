const request = require('request')
require('../scss/components/sponsorship-list.scss')



let make = (info, container) => {
    if (!info) return

    let imageURL = sponsor => "/assets/sps/" + sponsor.imageName

    let makeInd = sponsor => {
        let wrap
        if (sponsor.imageName) {
            wrap = document.createElement('a')
            wrap.href = sponsor.url
            wrap.target = '_blank'

            let logo = document.createElement('img')
            wrap.appendChild(logo)

            logo.addEventListener('load', e => wrap.replaceChild(logo, logo))
            logo.src = imageURL(sponsor)
            logo.alt = sponsor.name + " Sponsorship Listing"
        }
        return wrap
    }
    
    let wrap = document.createElement('article')
    let title = document.createElement('h2')
    title.innerHTML = "2020's Sponsors"
    wrap.appendChild(title)
    wrap.id = "sponsor-list"
    let teirs = [
        document.createElement('section'),
        document.createElement('section'),
        document.createElement('section')
    ]
    // teirs.forEach(t => wrap.appendChild(t))

    for (let i = 0; i < teirs.length; i++) {
        teirs[i].id = "teir" + (i+1).toString() + "Sponsors"
        wrap.appendChild(teirs[i])
    }

    info.forEach(
        i => {
            let listing = makeInd(i)
            if (listing)
                teirs[i.teir - 1].appendChild(listing)
        } )
    
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
    let getSponsors = (err, response, body) => make(body, target)
    request.get(sponsorsRq, getSponsors)
}

module.exports.default = container => {
    container = container instanceof HTMLElement ?
        container : document.createElement('section')
    
    get(container)

    container.id = container.id ? container.id : "sponsor-container"
    document.body.appendChild(container)
}