var express = require('express');
var app = express();


app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/shortener/*", function (request, response) {
  var url = request.params[0];
  if (!url.startsWith("http://www.") && !url.startsWith("https://www.")) {
    response.send({error: "Wrong format"})
  }
  else {
    // generate ID
    var id = "X05";
    // store to mongo
    
    response.send({short_url: "https://fertile-tub.glitch.me/"+id});
    
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
