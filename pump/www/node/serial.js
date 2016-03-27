var firmata = require('firmata');

var arduino = new firmata.Board("/dev/ttyATH0", function (err) {
    if (err) {
        console.log(err);
        board.reset();
        return;
    }

    console.log('Connected to Arduino');
    console.log('board.firmware: ', board.firmware);

    board.pinMode(13, board.MODES.OUTPUT);


});