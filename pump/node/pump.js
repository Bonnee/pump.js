process.stdout.write("Starting...");

var address = 'http://192.168.1.4:11111';

process.stdout.write('loading bridge...');
var bridge = require('./bridge.js');
var arduino = new bridge();

// Arduino connection code
arduino.on('data', function(data) {
	console.log('Arduino: ' + data);
	data = JSON.parse(data);
	if (data.id == 'levels') {
		io.emit('log', {
			type: data.id,
			timestamp: new Date().toISOString(),
			level: data.data
		});
	}
});

// OsO connection code
process.stdout.write('loading socket...');
var io = require('socket.io-client')(address);

io.once('connect', function open() {
	console.log('Connected to Ohm sweet Ohm');
	// Send MAC address for identification
	getMac(function(mac) {
		io.emit('hello', mac);
	});
});

io.once('pair', function(data) {
	var manifest;
	require('fs').readFile('/mnt/sda1/arduino/node/manifest.json', function(err, manifest) {
		//manifest = JSON.parse(manifest);
		io.emit('cpair', JSON.parse(manifest));
	});
});

io.once('hello', function() {
	console.log('Successfully associated to server');
})

io.on('error', function(data) {
	console.log(data);
})

io.on('message', function(data) {
	console.log('Received: ' + data)
});

io.on('disconnect', function() {
	console.log('Disconnected from server.');
})

io.on('reconnect', function() {
	console.log('Connected to server.');
})

function getMac(back) {
	require('getmac').getMac(function(err, mac) {
		if (err) throw err;
		back(mac);
	});
}

console.log('done.');
