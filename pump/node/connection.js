var io = require('socket.io-client');
var ev = require('events').EventEmitter;
var util = require("util");

this.Client = function(addr) {
	var self=this;
	var ready=false;

	process.stdout.write('socket...');
	io = io.connect(addr);
	var state = State.Disconnected;

	io.on('connect', function open() {
		state = State.Connecting;
		console.log('Connecting to Ohm sweet Ohm...');
		// Send MAC address for identification
		getMac(function(mac) {
			io.emit('hello', mac);
		});
	});

	io.on('hello', function(data) {
		state = State.Connected;
		ready=true;
		self.emit('connected');
		console.log('Successfully connected to OsO');
	});

	io.on('pair', function(data) {
		state = State.Pairing
		var manifest;
		require('fs').readFile('/mnt/sda1/arduino/node/manifest.json', function(err, manifest) {
			//manifest = JSON.parse(manifest);
			io.emit('pair', JSON.parse(manifest));
		});
	});

	io.on('message', function(data) {
		console.log('Received: ' + data)
	});

	io.on('disconnect', function() {
		console.log('Disconnected from server.');
	});

	io.on('reconnect', function() {
		console.log('Connected to server.');
	});

	io.on('error', function(data) {
		state = State.Error;
		console.log(data);
	});

this.emit=function(id,data){
	if(ready)
	io.emit(id,data);
}

	function getMac(back) {
		require('getmac').getMac(function(err, mac) {
			if (err) throw err;
			back(mac);
		});
	}
}

var State = {
	Disconnected: -1,
	Connecting: 0,
	Pairing: 1,
	Connected: 2,
	Error: 3
}

util.inherits(this.Client, ev);
ev.call(this);
module.exports = this.Client;
