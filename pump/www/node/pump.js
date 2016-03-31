process.stdout.write("Starting server...");

var cn =  require('./connection.js');
var client = new cn('ws://192.168.1.120:10611');

var sr = require('./serial.js');
var arduino = new sr('/dev/ttyATH0');

arduino.on('open', function () {
    console.log('Connected to Arduino');
    console.log('Running ', arduino.firmware);
    arduino.pinMode(13, arduino.HIGH);
});

client.on('connection', function () {
    console.log('Connected to iot server');
    // Send MAC address for identification
    require('getmac').getMac(function(err,mac){
    if (err)  throw err
    client.send('hello', mac);
  });
});

client.on('data', function (data) {
    console.log('Received: ' + data);
});

console.log('started.');
