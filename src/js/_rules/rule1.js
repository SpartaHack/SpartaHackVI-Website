function test(user, context, callback) {
    let nameSpace = "http://localhost:9000/";
      let CB = (err, response, body, cb) => {
          console.log("\n----->>>>\n", err, body, "\n----->>>>\n");
          if (response && response.statusCode === 200) {
          context.idToken[nameSpace + "pt"] = body.auth_id;
        callback(null, user, context);
      }
      else if (response.finished && !err) cb();
    };
    
    // --- 
    
      let loginReq = {
          headers: {
          "Content-Type":"application/json",
          "Accept": "vnd.example.v2"
          },
          url: "http://api.elephant.spartahack.com/sessions",
          body: {
          "email": user.email ? user.email : "null",
          "ID_Token": context.query ? context.query.state : "null"
          },
          json: true
      };
    
    // --- 
      
    let createReq = {
          headers: {
          "Content-Type":"application/json",
      },
      url: "http://api.elephant.spartahack.com/users",
      body: {
          "email": user.eamil,
           "first_name": user.given_name,
        "last_name": user.family_name,
        "ID_Token": context.query ? context.query.client_id : "null"
      },
      json: true
    };
    
    // --- 
      
      let loginCb = (err, response, body) => CB(err, response, body, 
          () => callback(new Error('Invalid User'))); 
    
    let createCb = (err, response, body) => 
        CB(err, response, body, () => request.post(loginReq, loginCb));
    // console.log(user.email, '\n ---- \n', context.query);

    console.log("!___====", context);
    // ---   
    request.post(createReq, createCb);
      //console.log("\n>>>>\n", user,"\n##^^^^##\n", context,"\n>>>>\n");
    //callback(null, user, context);
     
  }