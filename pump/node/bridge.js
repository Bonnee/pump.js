//var SerialPort = require("serialport").SerialPort

var ev = require('events').EventEmitter;
var util = require("util");

this.bridge = function() {
	var self = this;
	process.stdin.pipe(require('split')()).on('data', function(data) {
		self.emit('data', data);
	});
}

util.inherits(this.bridge, ev);
ev.call(this);
module.exports = this.bridge;
