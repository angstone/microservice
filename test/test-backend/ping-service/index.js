const micro = require('../../../index.js').create();

micro.start(()=>{
	console.log('Deus Seja Louvado Em Todo Tempo!');
	micro.act({topic: 'system', cmd: 'ping'}, (ans, result)=>{
		console.log(result);
	});
});
