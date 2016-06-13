/*
 pump.js
 This is the main project file. Its job is to start all the classes and connections to the server and to the Arduino.
	Another crucial porpouse of this file is to handle the communication between all the parts of the project.
*/

process.stdout.write("Loading...");

var address = 'http://192.168.1.4:11111';

process.stdout.write('bridge...');
var bridge = require('./bridge.js');
var arduino = new bridge();

var socket = require('./connection');
var io = new socket(address, __dirname + '/../manifest.json');

// Arduino connection code
arduino.on('data', function(data) {
	console.log('Arduino ' + data);
	data = JSON.parse(data);

	// data: {type: *warning-log*, caller: *pump1-level*, value: *1-0-45.24*}

	//if (data.type == "state") {
	io.emit(data.type, {
		id: data.caller,
		data: [new Date().toISOString(), data.value]
	});
	/*}
	else if (data.type == "warning") {
		io.emit('warning', {
			id: data.caller,
			data: [data.value, new Date().toISOString()]
		});*/
});

console.log('done.');
