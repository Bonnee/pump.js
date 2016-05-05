process.stdout.write("Loading test...");

var address = 'http://192.168.1.4:11111';

var socket = require('../node/connection.js');
var io = new socket(address, '../node/manifest.json');

setInterval(function() {
	var message = {
		id: 'level',
		value: Math.round(Math.random() * 10000) / 100,
		timestamp: new Date().toISOString()
	};
	console.log('Sending: ' + JSON.stringify(message));
	io.emit('log', message);
}, 2000);

console.log('done.');
