console.log("Starting node server...");

var logPath="../log.csv";

var fs = require('fs');

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

wss.on('close', function close() {
  console.log('disconnected');
});

fs.watch(logPath, function(curr, prev) {
    console.log("File accessed. " + curr.mtime);
    if(curr.mtime != prev.mtime){
        console.log("File modified");
        wss.clients.forEach(function each(client) {
            client.send("File modified");
        });
    }
});