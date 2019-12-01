function test(user, context, callback) {
    let nameSpace = "http://localhost:9000/";
    
    let body = {
        "email": user.email ? user.email : "null",
        "first_name": user.given_name ? user.given_name : "null",
        "last_name": user.family_name ? user.family_name : "null",
        "ID_Token": context.idToken ? context.idToken : "null"
    };
    let reqContent = {
        headers: {
          "Content-Type":"application/json",
          "Authorization": context.accessToken ? context.accessToken : "null"
        },
        url: "http://api.elephant.spartahack.com/users",
        body: body,
        json: true
    };

    let sCB = (err, response, body) => {
        console.log(body);

        context.idToken["http://localhost:9000/pt"] = body && body.auth_id ?  body.auth_id : "null";
        callback(null, user, context);
    };

    let eCB = (err, response, body) => {
        context.idToken["http://localhost:9000/pt"] = "error";
        callback(null, null, null);
    };

    request.post(reqContent).on('response', sCB);//, sCB, eCB); 
}