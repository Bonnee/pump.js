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
	var stamp = new Date();
	console.log('Arduino ' + data);

	data = JSON.parse(data);
	var msg;
	// data: {type: *warning-log*, caller: *pump1-level*, value: *1-0-45.24*}

	if (data.caller.indexOf("pump") > -1) { // Hack to make the level's and pump's date the same.
		msg = {
			id: data.caller,
			data: [stamp, data.value[0]]
		}
		console.log(msg);
		io.emit(data.type, msg);

		msg = {
			id: "level",
			data: [stamp, data.value[1]]
		}
		console.log(msg);
		io.emit(data.type, msg);
	} else {
		msg = {
			id: data.caller,
			data: [stamp, data.value]
		}
		console.log(msg);
		io.emit(data.type, msg);
	}
});

console.log('done.');
