var express = require('express');


var app = express();



app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/search*", function (request, response) {
  
  
});

app.get("/search/latest", function(request, response) {
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
