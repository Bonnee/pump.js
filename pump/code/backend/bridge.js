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
