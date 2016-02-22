var port = 1337;
var host = '127.0.0.1';

var http = require('http');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
})

server.listen(port, host);

console.log('Server running at http://' + host + ':' + port + '/');