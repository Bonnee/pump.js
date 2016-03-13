process.stdout.write("Starting server...");

var logPath = "../log.csv";

var fs = require('fs');

var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({
        port: 8080
    });

wss.broadcast = function (data) {
    for (var i in this.clients)
        this.clients[i].send(data);
}

wss.on('connection', function connection(ws) {
    console.log('Connection from: ' + ws._socket.remoteAddress + ':' + ws._socket.remotePort);

    ws.on('message', function (message) {
        console.log(ws._socket.remoteAddress + ':' + ws._socket.remotePort + ': ' + message);
        if (message == 'levHistory') {
            ws.send(JSON.stringify(readFile(logPath)));
        }
    });

    ws.on('close', function close() {
        console.log(ws._socket.remoteAddress + ': ' + ws._socket.remotePort + 'disconnected.');
    });
});


fs.watchFile(logPath, function (curr, prev) {
    if (curr.mtime != prev.mtime) {
        console.log(logPath + ' was modified on ' + curr.mtime);
        var data = readFile(logPath);
        wss.broadcast(JSON.stringify(data[data.length - 1]));
    }
});

function readFile(path) {
    var data = fs.readFileSync(path).toString().replace('\r', '').split("\n");
    var res = [];
    for (var i = 0; i < data.length - 1; i++) {
        res.push(data[i].split(','));
    }

    return res;
}

console.log("Started.");