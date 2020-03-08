function test(user, context, callback) {
  let nameSpace, apiBase;
  if (context.request.query.redirect_uri.substr(8, 10) === "spartahack") {
    nameSpace = "https://spartahack.com/";
    apiBase = "https://api.spartahack.com/";
  }
  else {
    nameSpace = "http://website.elephant.spartahack.com/";
    apiBase = "http://api.elephant.spartahack.com/";
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
      if (body.id)
        context.idToken[nameSpace + "pid"] = body.id;
      if (body.rsvp_id)
        context.idToken[nameSpace + "rsvp"] = body.rsvp_id;
      if (body.encrypted_password && body.created_at) {
        let p2 = new Date(body.created_at);
        context.idToken[nameSpace + "lk"] = body.encrypted_password + p2.getTime().toString();
      }
      cb();            
    }
    else if (response && response.statusCode === 409 || response.statusCode === 201)
      cb();
    else if (response && response.statusCode !== 400)
      CB(err, response, body, cb);
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
      "first_name": user.given_name ? user.given_name : (user.first_name ? user.first_name : "null"),
      "last_name": user.family_name ? user.family_name : (user.last_name ? user.last_nae : "null"),
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
