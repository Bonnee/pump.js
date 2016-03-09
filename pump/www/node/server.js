console.log("Starting node server...");

var logPath="../log.csv";

var fs = require('fs');

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
    
    fs.watch(logPath, function(curr, prev) {
        console.log("File accessed");
        ws.send(curr.mtime);
    });
});


