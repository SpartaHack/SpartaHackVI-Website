const req = require('./../req')

let submit = (main, conditions) => {
    main.out.other_dietary_restrictions = "None"
    main.out.attending = "Yes"
    
    submitRq = {
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Request-Method": "POST",
            "X-WWW-USER-TOKEN": main.user.pt
        },  
        body: main.out,
        url: req.base + "/rsvps",
        json: true
    },
    submitApp = (err, response, body) => {
        if (body)
            body.status = body.status ? body.status.toString() : "Other"
        else body = {
            'status': 'Other',
            'message': 'Probable CORS issue' 
        }

        if (conditions[body.status]) (conditions[body.status])()

        else if (body.status != "201" && conditions.otherError)
            conditions.otherError(main, response) 
    }
    console.log(submitRq, main)
    req.uest.post(submitRq, submitApp)
}

module.exports.default = submit
