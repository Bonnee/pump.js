var serialport = require('serialport');
var serialPort = serialport.SerialPort;

var arduino = new serialPort("/dev/ttyATH0", {
    baudrate: 115200
    , parser: serialport.parsers.raw
    , raw_frames: false
});

arduino.on('open', function () {
    console.log('Connected to Arduino');

    arduino.on('data', function (data) {
        console.log(data);
    });
});