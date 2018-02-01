const micro = require('../../../index.js').create();
micro.addProcedures(require('./procedures'));

micro.add({topic: 'system', cmd: 'ping'}, async (resp)=>{
	return {result: 'pong'};
});

micro.add({topic: 'system', cmd: 'pingmocked'}, (req, cb)=>{
	micro.env.mock = true;
	return micro.mock(req, cb, 'ping', {result: 'pong mocked'});
});

micro.add({topic: 'system', cmd: 'pingprocedured'}, (req, cb)=>{
	micro.env.mock = false;
	return micro.mock(req, cb, 'ping', {result: 'pong mocked'});
});

micro.start();
