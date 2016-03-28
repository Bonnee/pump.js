process.stdout.write("Starting server...");

var cn = require('./connection.js');
var client = new cn('ws://192.168.1.120:10611');

var sr = require('./serial.js');
var arduino = new sr('/dev/ttyATH0');

console.log("started.");

client.on('connected', function () {
    console.log('Connected to iot server');
});

client.on('data', function (data) {
    console.log('Received: ' + data);
});