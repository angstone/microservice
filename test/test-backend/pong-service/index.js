const micro = require('../../../index.js').create();

micro.add({topic: 'system', cmd: 'ping'}, async (resp)=>{
	return {result: 'pong'};
})

micro.start();
