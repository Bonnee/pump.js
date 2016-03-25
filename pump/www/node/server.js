process.stdout.write("Starting server...");

var serialport = require('serialport');
var serialPort = serialport.SerialPort;

var arduino = new serialPort("/dev/ttyATH0", {
    baudrate: 115200
    , parser: serialport.parsers.raw
    , raw_frames: false
});

arduino.on('open', function () {
    console.log('Connected to Arduino');

    arduino.on('data', function (data) {
        console.log(data);
    });
});

var db = require('mariasql');

var Storage = new db({
    host: 'ServerPi.local'
    , user: 'pump'
    , password: 'pump'
})

var fs = require('fs');

var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({
        port: 8080
    });

var logPath = "/mnt/sda1/arduino/www/pump/log.csv";

wss.broadcast = function (data) {
    for (var i in this.clients)
        send(this.clients[i], data, 'upd');
}

wss.on('connection', function connection(ws) {
    console.log('Connection from: ' + ws._socket.remoteAddress + ':' + ws._socket.remotePort);

    ws.on('message', function (message) {
        console.log(ws._socket.remoteAddress + ':' + ws._socket.remotePort + ': ' + message);
        if (message == 'levHistory') {
            send(ws, JSON.stringify(readFile(logPath)), 'req');
        }
    });

    ws.on('close', function close() {
        console.log(ws._socket.remoteAddress + ': ' + ws._socket.remotePort + 'disconnected.');
    });
});

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