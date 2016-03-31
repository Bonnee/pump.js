var ws = require('ws');
var ev = require('events').EventEmitter;
var util = require("util");

this.client = function (url) {
    var self = this;
    var wsc = new ws(url);

    wsc.on('open', function open() {
        self.emit('connection');
    });

    wsc.on('message', function (data) {
        self.emit('data', data);
    });

    this.send = function(id, data) {
      wsc.send(JSON.stringify({ id: id, data: data }));
    }
}

util.inherits(this.client, ev);
ev.call(this);
module.exports = this.client;
