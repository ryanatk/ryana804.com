var http = require('http');
var fs = require('fs');

// host + port where you'll load this page in your browser
var HOST = 'localhost';
var PORT = '8841';

var CONTENT_TYPE = {
  'txt': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'js': 'text/javascript',
  'png': 'image/png',
  'gif': 'image/gif',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg'
};

http.createServer(function (req, res) {
  // parse the request url so we can grab the right file
  var path = req.url.split('?')[0];
  var loc = __dirname + '/html' + path;

  fs.readFile(loc, function (err, data) {
    if (err) {
      // if we don't find the file, send back a 404
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404 page not found\n');
      console.log('404:', req.url);
    } else {
      // grab the file's extension so we serve the proper content type
      var ct = CONTENT_TYPE[path.split('.')[1]] || 'text/plain';

      // if we find the file, respond in the browser
      res.writeHead(200, { 'Content-Type': ct });
      if (ct.indexOf('image') === 0) {
        res.end(data, 'binary');
      } else {
        res.end(data);
      }
      console.log('200:', ct, req.url);
    }
  });
}).listen(PORT, HOST);

// hit this url (add on the page you want to see) in your browser
console.log('Server running at ' + HOST + ':' + PORT + '/');
