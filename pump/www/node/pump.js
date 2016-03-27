process.stdout.write("Starting server...");

var cn = require('./connection.js');
var client = cn.client('ws://ServerPi.local:10611');

//var sr = require('./serial.js');

var fs = require('fs'); // TO BE REMOVED

var logPath = "/mnt/sda1/arduino/www/pump/log.csv";

server.on('conn', function (ws) {
    console.log('Connection from: ' + ws._socket.remoteAddress + ':' + ws._socket.remotePort);

    ws.on('data', function (message) {
        console.log(ws._socket.remoteAddress + ':' + ws._socket.remotePort + ': ' + message);
        if (message == 'levHistory') {
            send(ws, JSON.stringify(readFile(logPath)), 'req');
        }
    });

    ws.on('close', function close() {
        console.log(ws._socket.remoteAddress + ': ' + ws._socket.remotePort + 'disconnected.');
    });
})

// Watches the log file and sends a broadcast update
fs.watchFile(logPath, function (curr, prev) {
    if (curr.mtime != prev.mtime) {
        console.log(logPath + ' was modified on ' + curr.mtime);
        var data = readFile(logPath);
        wss.broadcast(JSON.stringify(data[data.length - 1]));
    }
});

function send(connection, data, id) {
    var pkt = {
        'id': id
        , 'data': data
    }
    connection.send(JSON.stringify(pkt));
}

// Returns the log as an array
function readFile(path) {
    var data = fs.readFileSync(path).toString().replace('\r', '').split("\n");
    var res = [];
    for (var i = 0; i < data.length - 1; i++) {
        res.push(data[i].split(','));
    }

    return res;
}

console.log("started.");