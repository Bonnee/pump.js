console.log("Starting node server...");

var logPath="../log.csv";

var fs = require('fs');

fs.readFile(logPath, 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});


var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
    
    fs.watchFile(logPath, function(curr, prev) {
        console.log("File accessed");
        ws.send("data");
    });
});


