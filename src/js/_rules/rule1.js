function test(user, context, callback) {
    let reqContent = {
        url: "http://api.elephant.spartahack.com/users",
        headers: {
          "Content-Type":"application/json",
          "Authorization": auth
        },
        body: {
            "email": email,
                  "first_name": name[0],
                  "last_name": name[1],
                  "password": auth,
                  "password_confirmation": auth,
                  "roles": roles
        }  
    };

    let sCB = (err, response, body) => {
        callback(null, user, context);
    };

    let eCB = (err, response, body) => {
        
    };

    request.post(reqContent, sCB, eCB); 
    
    context.idToken["http://localhost:9000/auth_id"] = user.user_id;
    callback(null, user, context);
}