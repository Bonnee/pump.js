/*
	bridge.js
	As the name suggests, this handles the communication between Arduino and Yun's Linux system.
	That's based upon the standard Arduino bridge written in Python and uses stdin and stdout to communicate.
	When stdin data is received, this class fires an event containing the received data.
*/

var ev = require('events').EventEmitter;
var util = require("util");

this.Bridge = function() {
	var self = this;
	process.stdin.pipe(require('split')()).on('data', function(data) {
		self.emit('data', data);
	});
}

util.inherits(this.Bridge, ev);
ev.call(this);
module.exports = this.Bridge;
