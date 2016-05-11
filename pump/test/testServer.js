process.stdout.write("Loading test...");

var address = 'http://192.168.1.4:11111';

var socket = require('../node/connection.js');
var io = new socket(address, '../node/manifest.json');

setInterval(function() {

	if (Math.random() > 0.35) {
		var message = {
			id: types[Math.floor(Math.random() * types.length)],
			value: Math.round(Math.random() * 10000) / 100,
			timestamp: new Date().toISOString()
		};
		console.log('Sending: ' + JSON.stringify(message));
		io.emit('log', message);
	} else {
		io.emit("warning", {
			id: types[Math.floor(Math.random() * types.length)],
			value: Math.round(Math.random())
		})
	}
}, 5000);


var types = ["level", "pump1", "pump2"];


console.log('done.');
