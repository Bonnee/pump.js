process.stdout.write("Starting server...");

var cn = require('./connection.js');
var client = new cn('ws://192.168.1.4:11111');

var bridge = require('./bridge.js');
var arduino = new bridge();

// Arduino connection code
arduino.on('data', function(data) {
	console.log('Received: ' + JSON.parse(data));
	data = JSON.parse(data);
	if (data.id == 'log') {
		client.send('log', JSON.stringify({
			timestamp: new Date().toISOString(),
			data: data.data
		}));
	}
});

// OsO connection code
client.on('open', function() {
	console.log('Connected to Ohm sweet Ohm');
	// Send MAC address for identification
	getMac(function(mac) {
		client.send('hello', mac);
	});
});

client.on('message', function(data) {
	console.log(data);
	data = JSON.parse(data);

	if (data.id == 'who') {
		var manifest;
		require('fs').readFile('manifest.json', function(err, manifest) {
			manifest = JSON.parse(manifest);
			client.send('who', JSON.stringify(manifest));
		});
	} else {}
});

function getMac(back) {
	require('getmac').getMac(function(err, mac) {
		if (err) throw err;
		back(mac);
	});
}

console.log('started.');