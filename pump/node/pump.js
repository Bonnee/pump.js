process.stdout.write("Loading...");

var address = 'http://192.168.6.62:11111';

process.stdout.write('bridge...');
var bridge = require('./bridge.js');
var arduino = new bridge();

var socket = require('./connection')
var io = new socket(address);

// Arduino connection code
arduino.on('data', function(data) {
	console.log('Arduino: ' + data);
	data = JSON.parse(data);

	// data: {type: *warning-state*, caller: *pump1-level*, value: *1-0-45.24*}

	if (data.type == "level") {
		io.emit('log', {
			id: data.caller,
			value: data.value,
			timestamp: new Date().toISOString()
		});
	} else if (data.type == "state") {
		io.emit('log', {
			id: data.caller,
			value: data.value,
			timestamp: new Date().toISOString()
		});
	} else if (data.type == "warning") {
		io.emit('warning', {
			id: data.caller,
			value: data.value
		});
	} else {
		io.emit('log', data);
	}
});

// OsO connection code

//var socket = new io(address);

console.log('done.');
