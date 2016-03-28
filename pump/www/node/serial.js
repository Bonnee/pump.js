var firmata = require('firmata');
var ev = require('events').EventEmitter;
var util = require("util");

this.serial = function (port) {
    var self = this;
    var arduino = new firmata.Board(port);
    this.HIGH = arduino.HIGH;
    this.LOW = arduino.LOW;

    arduino.on('ready', function () {
        self.emit('open');
    });

    this.firmware = arduino.firmware;

    this.pinMode = function (pin, state) {
        arduino.pinMode(pin, state);
    }
}

util.inherits(this.serial, ev);
module.exports = this.serial;
ev.call(this);