var firmata = require('firmata');

this.serial = function (port) {
    var arduino = new firmata.Board(port);

    arduino.on("ready", function () {
        console.log('Connected to Arduino');
        console.log('board.firmware: ', arduino.firmware);

        arduino.pinMode(13, arduino.HIGH);
    });
}

module.exports = this.serial;