var SerialPort = require("serialport").SerialPort

var ev = require('events').EventEmitter;
var util = require("util");

this.serial = function(port) {
    var self = this;

    var arduino = new SerialPort(port, {
        baudrate: 57600
    });

    arduino.on('open', function() {
        console.log('open');
        arduino.write('ls\n', function(err, results) {
            console.log('err ' + err);
            console.log('results ' + results);
        });

        arduino.on('data', function(data) {
            console.log(data);
        })
    });
}

util.inherits(this.serial, ev);
ev.call(this);
module.exports = this.serial;
