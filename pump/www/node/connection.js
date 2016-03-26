var ws = require('ws');
var ev = require('events');
var util = require("util");

function Connection() {

}

Connection.client = function client(url) {
    var wsc = new ws(url);

    wsc.on('open', function open() {
        console.log('Connected to server');
    })
}

Connection.server = function (port) {
    ev.EventEmitter.call(this);

    var wss = new ws.Server({
        port: port
    });

    wss.broadcast = function (data) {
        for (var i in this.clients)
            send(this.clients[i], data, 'upd');
    }

    wss.on('connection', function (ws) {
        console.log('conn');
        this.emit('conn', ws);

        ws.on('message', function () {
            console.log('data');
            this.emit('data');
        });
    });
}
Connection.server.prototype = new ev.EventEmitter;

var method = Connection.prototype;
module.exports = Connection;