var express = require('express');
var mongodb = require('mongodb');


var app = express();
var mongoClient = mongodb.MongoClient;
var mongodburl = "mongodb://" + process.env.MONGO_NAME + ":" + process.env.MONGO_PASSWORD + "@ds229415.mlab.com:29415/" + process.env.MONGO_DBNAME;


app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/shortener/*", function (request, response) {
  var url = request.params[0];
  if (!url.startsWith("http://www.") && !url.startsWith("https://www.")) {
    response.send({error: "Wrong format"})
  }
  else {
    var id = null;
    
    mongoClient.connect(mongodburl, function(err, db) {
      if (err)
        throw err;
      id = "X05"
      mongodb.urls.insert({ "id": id, "url" : "bar" })
      db.close();
    })
    
    if (id != null) {
      response.send({short_url: "https://fertile-tub.glitch.me/"+id});
      
    }
    else {
      response.send({error: "Internal error"})
    }
  }
  
});

app.get("/:value", function(request, response) {
  
  // get from mongo server
  
  
  // if not found
  response.send({error: "Invalid id"})
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
