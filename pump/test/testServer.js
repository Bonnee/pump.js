process.stdout.write("Loading test...");

var address = 'http://192.168.1.4:11111';

var socket = require('../node/connection.js');
var io = new socket(address, '../node/manifest.json');

setInterval(function() {
	var message = {
		id: types[Math.floor(Math.random() * types.length)],
		value: Math.round(Math.random() * 10000) / 100,
		timestamp: new Date().toISOString()
	};
	console.log('Sending: ' + JSON.stringify(message));
	io.emit('log', message);
}, 5000);


var types = ["level", "pump1", "pump2", "warning"];


console.log('done.');
