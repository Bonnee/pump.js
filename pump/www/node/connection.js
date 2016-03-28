var ws = require('ws');
var ev = require('events').EventEmitter;
var util = require("util");

this.client = function (url) {
    var self = this;

    var wsc = new ws(url);

    wsc.on('open', function open() {
        self.emit('connected');
    })

    wsc.on('message', function (data) {
        self.emit('data', data);
    });
}

util.inherits(this.client, ev);
module.exports = this.client;
ev.call(this);