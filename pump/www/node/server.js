console.log("Starting server...");

/*var arduinoFirmata = require('arduino-firmata');
var arduino = new arduinoFirmata();
arduino.connect('/dev/ttyATH0');*/

var logPath="../log.csv";

var fs = require('fs');

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });
console.log("Started.");

wss.broadcast = function(data) {
    for (var i in this.clients)
        this.clients[i].send(data);
}


wss.on('connection', function connection(ws) {
    console.log('Connection from: ' + ws._socket.remoteAddress + ':' + ws._socket.remotePort);
    
    ws.on('message', function(message) {
        console.log(ws._socket.remoteAddress + ':' + ws._socket.remotePort + ': ' + message);
        if(message == 'levHistory') {
            console.log('Sending reading history');
            ws.send(message + ':' + readFile(logPath));
        }
    });
    
    ws.on('close', function close() {
        console.log(ws._socket.remoteAddress + ': ' + ws._socket.remotePort + 'disconnected.');
    });
});


fs.watchFile(logPath, function(curr, prev) {
    console.log("File accessed. " + curr.mtime);
    if(curr.mtime != prev.mtime) {
        console.log("File modified" + curr.mtime);
            wss.broadcast("File modified: " + curr.mtime);
    }
});

function readFile(path) {
    var data = fs.readFileSync(path).toString().split("\n");
    var res = [];
    for(var i=0;i<data.length - 1;i++){
        res.push(data[i].split(','));
    }
    
    return JSON.stringify(res);
}