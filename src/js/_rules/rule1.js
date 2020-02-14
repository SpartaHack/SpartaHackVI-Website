function test(user, context, callback) {
  let nameSpace, apiBase;
  if (context.request.query.redirect_uri.substr(8, 3) != "api") {
    nameSpace = "https://spartahack.com/";
    apiBase = "https://api.spartahack.com/";
  }
  else {
    nameSpace = "http://website.elephant.spartahack.com/";
    apiBase = "http://api.elephant.spartahack.com";
  }
  console.log(context);
  // ---
  let count = 0;
  let CB = (err, response, body, cb) => {
    console.log(++count, "\n----->>>>\n", body, "\n----->>>>\n");
    if (response && response.statusCode === 200) {
      context.idToken[nameSpace + "pt"] = body.auth_token;
      if (body.application_id)
        context.idToken[nameSpace + "aid"] = body.application_id;
      if (body.rsvp_id)
        context.idToken[nameSpace + "rsvp"] = body.rsvp_id;
      cb();            
    }
    else if (response && response.statusCode === 409 || response.statusCode === 201) {
      cb();
    }
    else CB(err, response, body, cb);

  };    
  // ---
  let loginReq = {
      headers: {
        "Content-Type":"application/json",
        "Accept": "vnd.example.v2"
      },
      url: apiBase+"sessions",
      body: {
        "email": user.email ? user.email : "null",
        "ID_Token": context.clientID
      },
      json: true
  },
  createReq = {
    headers: {
      "Content-Type":"application/json",
    },
    url: apiBase+"users",
    body: {
      "email": user.email,
      "first_name": user.given_name ? user.given_name : "null",
      "last_name": user.family_name ? user.family_name : "null",
      "auth_id": user.user_id,
      "ID_Token": context.clientID
    },
    json: true
  },
  loginCb = (err, response, body) => CB(err, response, body, 
    () => callback(null, user, context)),
  createCb = (err, response, body) => 
    CB(err, response, body, () => request.post(loginReq, loginCb));

  request.post(createReq, createCb);
} 
