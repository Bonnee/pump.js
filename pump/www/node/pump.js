process.stdout.write("Starting server...");

var cn = require('./connection.js');
var client = new cn('ws://192.168.1.4:11111');

var sr = require('./serial.js');
var arduino = new sr('/dev/ttyATH0');

arduino.on('open', function() {
    console.log('Connected to Arduino');
    console.log('Running ', arduino.firmware);
    arduino.pinMode(13, arduino.HIGH);
});

client.on('open', function() {
    console.log('Connected to iot server');
    // Send MAC address for identification
    getMac(function(mac) {
        client.send('hello', mac);
    });
});

client.on('message', function(data) {
    console.log(data);
    data = JSON.parse(data);
    if (data.id == 'who') {
        var manifest;
        require('fs').readFile('manifest.json', function(err, mani) {
            console.log(mani.toString());
            manifest = JSON.parse(mani.toString());

            getMac(function(mac) {
                manifest["mac"] = mac;
                client.send('who', JSON.stringify(manifest));
            });
        });
    }
    console.log('Received: ' + data);
});

function getMac(back) {
    require('getmac').getMac(function(err, mac) {
        if (err) throw err;
        back(mac);
    });
}

console.log('started.');
