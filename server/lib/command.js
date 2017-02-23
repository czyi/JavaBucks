var spawn = require('child_process').spawn;
var Client = require('ssh2').Client;

var ssh = {
	host: '192.168.2.2',
	port: 22,
	// try to fix some unknown error
	tryKeyboard: true
};

var conn = new Client();

module.exports = {

	login: function(data, callback) {
		if (!data.password) {
			callback && callback(null, { errno: 1, errmsg: 'no password' });
			return;
		}
		ssh.username = data.username;
		ssh.password = data.password;
		conn.on('ready', function() {
			console.log('Client::ready');
			conn.shell(function(err, stream) {
				if (err) throw err;
				stream.on('close', function() {
					console.log('Stream::close');
					conn.end();
				}).stderr.on('data', function(data) {
					console.log('STDERR: ' + data);
				});
				callback && callback(stream);
			});
		}).on('error', function(err) {
			callback && callback(null, err);
		}).connect(ssh)

	},

	run: function(text, callback) {

		var inst = text.split(/\s+/), cmd = inst.shift();
	    var exec = spawn(cmd, inst);
	    exec.stdout.on('data', function(data) {
	        callback(data);
	        //console.log(`stdout: ${data}`);
	    });
	}

}
