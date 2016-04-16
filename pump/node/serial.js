var SerialPort = require("serialport").SerialPort

var ev = require('events').EventEmitter;
var util = require("util");

this.serial = function(port, baud) {
    var self = this;
    
    var arduino = new SerialPort(port, {
        baudrate: baud,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    }, false);

    this.open = function() {
        arduino.open();
    }

    arduino.on('open', function() {
        self.emit('open');

        arduino.write('prova lel\n');

        arduino.on('data', function(data) {
            console.log(data);
            console.log(data.toString('UTF-8'));
        });

        arduino.on('disconnect', function() {
            self.emit('disconnect');
        })

        arduino.on('close', function() {
            console.log('The port has closed.');
        })

        arduino.on('error', function(er) {
            console.log(error);
        });
    });
}

util.inherits(this.serial, ev);
ev.call(this);
module.exports = this.serial;
