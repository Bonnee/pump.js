var ev = require('events').EventEmitter;
var util = require("util");

this.Client = function(addr) {
	var self = this;
	var io = require('socket.io-client')(addr);

	io.on('connect', function open() {
		console.log('mark');
		self.emit('connect');
	});

	io.on('pair', function(data) {
		self.emit('pair', data);
	});

	io.on('error', function(data) {
		self.emit('hello', data);
	})

	io.on('message', function(data) {
		self.emit('message', data);
	});

	this.emit = function(id, data) {
		io.emit(id, data);
	}
}

//util.inherits(this.client, ev);
util.inherits(this.Client, ev);
ev.call(this);
module.exports = this;
