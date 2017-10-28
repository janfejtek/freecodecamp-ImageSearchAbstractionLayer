var express = require('express');
var GoogleImages = require('google-images');
const client = new GoogleImages(process.env.SEARCH_ID, process.env.SEARCH_API_KEY);
const MAX_LATEST = 10;

var app = express();

var latest = [];

function addLatest(term) {
  var data = {term: term, timestamp: new Date().toISOString()};
  latest.unshift(data);
  while (latest.length > MAX_LATEST) {
    latest.pop();
  }
}

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/search", function (request, response) {
  var term = request.query.term;
  var offset = request.query.offset;
  if (offset == undefined)
    offset = 0;
  addLatest(term);
  client.search(term, {start: offset, linkSite: "true"})
    .then(images => {
    var data = [];
    console.log(images);
    for (var idx in images) {
      data.push({url: images[idx].url, description: images[idx].description, originalurl: images[idx].parentPage});
    }
    response.send(data);
  });
  
});

app.get("/search/latest", function(request, response) {
  response.send(latest);
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
