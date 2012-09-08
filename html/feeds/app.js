var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    events = require("events"),
    sys = require("sys");

var Twitter = (function () {
  var eventEmitter = new events.EventEmitter(),
      tweets = {
                 EventEmitter : eventEmitter,
                 latestTweet : 0
               };

  return tweets;
})();

function getTweets(query) {
  var request = http.request({
    host:'search.twitter.com',
    port:80,
    method:'GET',
    path:'/search.json?since_id=' + Twitter.latestTweet + 'result_type=recent&rpp=5&q=' + query
  })
  .on('response', function (response) {
    var body = '';

    response.on('data', function (data) {
      body = body + data;

      try {
        var tweets = JSON.parse(body);
        if (tweets.results.length > 0) {
          Twitter.latestTweet = tweets.max_id_str;
          Twitter.EventEmitter.emit('tweets', tweets);
        }
        Twitter.EvenEmitter.removeAllListeners('tweets');
      }
      catch (ex) {
        console.log('waiting for mo data');
      }
    });
  });
  request.end();
}

function loadStaticWebFile(uri, response) {
  var filename = path.join(process.cwd(), uri);

  path.exists(filename, function(exists) {
    if (!exists) {
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.write('Fo oh fo');
      response.end();
      return;
    }

    fs.readFile(filename, 'binary', function (err, file) {
      if (err) {
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.write('500: ' + err);
        response.end();
        return;
      }
      response.writeHead(200);
      response.write(file, 'binary');
      response.end();
    });
  });
}

http.createServer(function (request, response) {
  var uri = url.parse(request.url).pathname,
      query;

  if (uri === '/twitter') {
    var timeout = setTimeout(function () {
      response.writeHead(200, {'Content-Type':'text/plain'});
      response.write(JSON.stringify([]));
      response.end();
    }, 2000);

    Twitter.EventEmitter.once('tweets', function (tweets) {
      response.writeHead(200, {'Content-Type':'text/plain'});
      response.write(JSON.stringify(tweets));
      response.end();

      clearTimeout(timeout);
    });
    query = request.url.split('?')[1];
    getTweets(query);
  } else {
    loadStaticWebFile(uri, response);
  }
}).listen(8124, "www.ryana804.com");
