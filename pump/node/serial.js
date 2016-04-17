//var SerialPort = require("serialport").SerialPort

var ev = require( 'events' ).EventEmitter;
var util = require( "util" );

this.serial = function( port, baud ) {}

util.inherits( this.serial, ev );
ev.call( this );
module.exports = this.serial;