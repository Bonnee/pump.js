process.stdout.write("Loading test...");

var address = 'http://192.168.1.4:11111';

var socket = require('../code/backend/connection.js');
var io = new socket(address, '../code/manifest.json');

var i = 0;
setInterval(function() {

	if (Math.random() > 0.2) {
		var message = {
			id: "level",
			value: Math.sin(i) * 100,
			timestamp: new Date().toISOString()
		};


		if (message.id.includes("pump"))
			message.value = Math.round(Math.random());
		console.log('Sending: ' + JSON.stringify(message));
		io.emit('log', message);
	} else {
		io.emit("warning", {
			id: types[Math.floor(Math.random() * types.length)],
			value: Math.round(Math.random())
		})
	}
	i += 0.1;
}, 2500);


var types = ["level", "pump1", "pump2"];


console.log('done.');
