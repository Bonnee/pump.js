var SerialPort = require("serialport").SerialPort

var ev = require('events').EventEmitter;
var util = require("util");

this.serial = function(port) {
    var self = this;

    var arduino = new SerialPort(port, {
        baudrate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    }, false);

    arduino.on('open', function() {
        self.emit('open');

        arduino.on('data', function(data) {
            console.log(data.toString('UTF-8'));
        });

        arduino.on('disconnect', function(){
          console.log('Arduino disconnected. Trying again...');
          arduino.open();
        })

        arduino.on('close', function(){
          console.log('The port has closed.');
        })

        arduino.on('error', function(er) {
            console.log(error);
        });
    });

    arduino.open();
}

util.inherits(this.serial, ev);
ev.call(this);
module.exports = this.serial;
