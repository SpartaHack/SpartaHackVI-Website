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
        if (body)
            body.status = body.status ? body.status.toString() : "Other"
        else body = {
            'status': 'Other',
            'message': 'Please let us know with screenshots of your aplication/console!' 
        }

        if (body) {
            director.reports.isSent(body) 
            window.localStorage.setItem('rsvpSent', true)
        }
        else
            director.reports.update(body.message, body)
    }

    req.uest.post(submitRq, submitRsvp)
    return
}

module.exports.default = submit
