var io = require('socket.io-client');
var ev = require('events').EventEmitter;
var util = require("util");
var fs = require('fs');

this.Client = function(addr, maniPath) {
	var self = this;
	var ready = false;
	var frontendPath = __dirname + '/../frontend';

	process.stdout.write('socket...');
	io = io.connect(addr);
	var state = State.Disconnected;

	io.on('connect', function open() {
		state = State.Connecting;
		console.log('Connecting to Ohm sweet Ohm...');
		// Send MAC address for identification
		getMac(function(mac) {
			io.emit('hello', mac);
		});
	});

	io.on('hello', function(data) {
		state = State.Connected;
		ready = true;
		self.emit('connected');
		console.log('Successfully connected to OsO');
	});

	io.on('pair', function(data) {
		state = State.Pairing;
		var manifest;
		fs.readFile(maniPath, function(err, manifest) {
			//manifest = JSON.parse(manifest);
			io.emit('pair', JSON.parse(manifest));
		});
	});

	io.on('dashboard', function() {
		console.log('Sending frontend files...')
		walk(frontendPath, function(path, dir) {
				console.log('Sending ' + path + '...');

				var pkt = {
					"path": require('path').relative(frontendPath, path),
					"dir": dir
				};

				if (!dir)
					pkt["file"] = fs.readFileSync(path);
				io.emit('dashboard', pkt);
			},
			function(er) {
				if (er)
					console.log(er);
				else
					console.log('Done.')
			});
	});

	io.on('message', function(data) {
		console.log('Received: ' + data)
	});

	io.on('disconnect', function() {
		ready = false;
		console.log('Disconnected from server.');
	});

	io.on('reconnect', function() {
		ready = true;
		console.log('Connected to server.');
	});

	io.on('error', function(data) {
		state = State.Error;
		console.log(data);
	});

	this.emit = function(id, data) {
		if (ready)
			io.emit(id, data);
	}

	function getMac(back) {
		require('getmac').getMac(function(err, mac) {
			if (err) throw err;
			back(mac);
		});
	}
}

var State = {
	Disconnected: -1,
	Connecting: 0,
	Pairing: 1,
	Connected: 2,
	Error: 3
}

var walk = function(dir, action, done) {

	// this flag will indicate if an error occured (in this case we don't want to go on walking the tree)
	var dead = false;

	// this flag will store the number of pending async operations
	var pending = 0;

	var fail = function(err) {
		if (!dead) {
			dead = true;
			done(err);
		}
	};

	var checkSuccess = function() {
		if (!dead && pending == 0) {
			done();
		}
	};

	var performAction = function(file, dir) {
		console.log(file);
		if (!dead) {
			try {
				action(file, dir);
			} catch (error) {
				fail(error);
			}
		}
	};

	// this function will recursively explore one directory in the context defined by the variables above
	var dive = function(dir) {
		pending++; // async operation starting after this line
		fs.readdir(dir, function(err, list) {
			if (!dead) { // if we are already dead, we don't do anything
				if (err) {
					fail(err); // if an error occured, let's fail
				} else { // iterate over the files
					list.forEach(function(file) {
						if (!dead) { // if we are already dead, we don't do anything
							var path = dir + "/" + file;
							pending++; // async operation starting after this line
							fs.stat(path, function(err, stat) {
								if (!dead) { // if we are already dead, we don't do anything
									if (err) {
										fail(err); // if an error occured, let's fail
									} else {
										if (stat && stat.isDirectory()) {
											performAction(path, true);
											dive(path); // it's a directory, let's explore recursively
										} else {
											performAction(path, false); // it's not a directory, just perform the action
										}
										pending--;
										checkSuccess(); // async operation complete
									}
								}
							});
						}
					});
					pending--;
					checkSuccess(); // async operation complete
				}
			}
		});
	};

	// start exploration
	dive(dir);
};

util.inherits(this.Client, ev);
ev.call(this);
module.exports = this.Client;
