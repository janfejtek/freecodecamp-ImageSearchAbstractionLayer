var express = require('express');
var mongodb = require('mongodb');


var app = express();
var mongoClient = mongodb.MongoClient;
var mongodburl = "mongodb://" + process.env.MONGO_NAME + ":" + process.env.MONGO_PASSWORD + "@ds229415.mlab.com:29415/" + process.env.MONGO_DBNAME;

const SHORT_LENGTH = 3;


function randomBase64() {
  var random = Math.floor(Math.random() * 64);
  if (random <= 25)
    return String.fromCharCode(97 + random);
  if (random <= 51)
    return String.fromCharCode(65 - 26 + random);
  if (random <= 61)
    return ""+(random- 52);
  switch(random) {
    case 62:
      return "-";
    case 63:
      return "_";
    default:
      return "=";
  }
}

function generateRandomId(length) {
  var generated = "";
  for (var i = 0; i< length; i++) {
    generated += randomBase64();
  }
  return generated;
}

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/shortener/*", function (request, response) {
  
  var url = request.params[0];
  if (!url.startsWith("http://www.") && !url.startsWith("https://www.")) {
    response.send({error: "Wrong format"})
  }
  else {
    
    mongoClient.connect(mongodburl, function(err, db) {
      if (err)
        throw err;
      
      var urlsCollection = db.collection('urls');
      
      
      urlsCollection.find({"url": url}).toArray(function(err, documents) {
        if (err)
          throw err;
        var id = null;
        if (documents.length == 0) {
          do {
            id = generateRandomId(SHORT_LENGTH);
          }
          while( urlsCollection.find({"id": id}).toArray(function(err, documents) {
            if (documents.length > 0)
              return false;
            else
              return true;
          }));
          
          
          
          db.collection('urls').insert({ "id": id, "url" : url }, function(err, data) {
            if (err)
              throw err;
            response.send({short_url: "https://fertile-tub.glitch.me/"+id});
          })
          
        }
        else {
          response.send({short_url: "https://fertile-tub.glitch.me/"+documents[0].id})
        }
      })
      
      
      
    })
  }
  
});

app.get("/:value", function(request, response) {
  var id = request.params.value;
  mongoClient.connect(mongodburl, function(err, db) {
      if (err)
        throw err;
    var urlsCollection = db.collection('urls');
    
    urlsCollection.find({"id": id}).toArray(function(err, documents) {
        if (err)
          throw err;
        if (documents.length === 0) {
          response.send({error: "Invalid id"})
          
        }
        else {
          response.redirect(documents[0].url)
        }
      })
    
  })
  
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
