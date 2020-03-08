const req = require('./../req')

let submit = (handler, director) => {
    handler.out.other_dietary_restrictions = "None"
    handler.out.attending = "Yes"
    let submitRq = {
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Request-Method": "POST",
            "X-WWW-USER-TOKEN": handler.token
        },  
        body: handler.out,
        url: req.base + "/rsvps",
        json: true
    },
    submitRsvp = (err, response, body) => {
        if (response && response.statusCode == 201) {
            director.reports.isSent(body) 
            window.localStorage.setItem('rsvpSent', true)
        }
        else {
            let errorCode = body ? body.message : "otherError"
            director.reports.update(errorCode, body)
        }
    }

    req.uest.post(submitRq, submitRsvp)
    return
}

module.exports.default = submit
