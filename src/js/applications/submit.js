const req = require('./../req')

let submit = (handler, director) => {
    handler.out['other_university'] = ""
    handler.out['outside_north_america'] = ""

    let submitRq = {
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Request-Method": "POST",
            "X-WWW-USER-TOKEN": handler.token
        },  
        body: handler.out,
        url: req.base + "/applications",
        json: true
    },
    submitApp = (err, response, body) => {

        if (body)
            body.status = body.status ? body.status.toString() : "Other"
        else body = {
            'status': 'Other',
            'message': 'Please let us know with screenshots of your aplication/console!'
        }

        if (body.status == "Applied") {
            director.reports.isSent(body)
            window.localStorage.setItem('appSent', true)
        }
        else director.reports.update(body.status, body)
    }

    req.uest.post(submitRq, submitApp)
    return
}

module.exports.default = submit
