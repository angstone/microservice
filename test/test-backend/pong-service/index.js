const micro = require('../../../index.js');

micro.setBase();

micro.consume('role:system, cmd:ping');

micro.seneca.add('role:system, cmd:ping', (args, callback) => {
	callback(null, {result:'pong'});
});

micro.start();
