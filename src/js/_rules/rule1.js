function test(user, context, callback) {
    let nameSpace = "http://localhost:9000/";

    let CB = (err, response, body, cb) => {
        if (response && response.statusCode === 200) {
            context.idToken[nameSpace + "pt"] = body.auth_id;
            callback(null, user, context);
        }
        else cb();
    };

    let userInfo = {
        "email": user.email ? user.email : "null",
        "password": context.idToken ? context.idToken : "null"
    };

    let tryLogin = {
        headers: {
            "Content-Type":"application/json",
            "Authorization": context.accessToken ? context.accessToken : "null",
            "Accept": "vnd.example.v2"
        },
        url: "http://api.elephant.spartahack.com/sessions",
        body: userInfo,
        json: true
    };

    let loginCb = (err, response, body) => CB(err, response, body, 
            () => callback(new Error('Invalid User')));
       

    let createFrom = {
        "email": user.email ? user.email : "null",
        "first_name": user.given_name ? user.given_name : "null",
        "last_name": user.family_name ? user.family_name : "null",
        "ID_Token": context.idToken ? context.idToken : "null"
    };
    
    let tryCreate = {
        headers: {
          "Content-Type":"application/json",
          "Authorization": context.accessToken ? context.accessToken : "null"
        },
        url: "http://api.elephant.spartahack.com/users",
        body: createFrom,
        json: true
    };

    let createCb = (err, response, body) => 
        CB(err, response, body, () => request.post(tryLogin, loginCb));
    
    request.post(tryCreate, createCb);
}

    /*{
        if (response && response.statusCode === 200) {
            context.idToken[nameSpace + "pt"] = body.auth_id;
            callback(null, user, context)
        }
        else if (response.finished) request.post(tryLogin, loginCb);

        CB(err, response, body, () => request.post(tryLogin, loginCb));
    };

    {
        if (response && response.statusCode === 200) {
            context.idToken[nameSpace + "pt"] = body.auth_id;
            callback(null, user, context);
        }
        else if (response.finished) {
            // context.idToken[nameSpace + "pt"] = "invalid";
            callback(new Error('Invalid user'));            
        }
    };

    */