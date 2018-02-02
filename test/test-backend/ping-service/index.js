const micro = require('../../../index.js').create();

micro.start(()=>{
	console.log('Deus Seja Louvado Em Todo Tempo!');

	// ping simple
	micro.act({topic: 'system', cmd: 'ping'}, (ans, result)=>{
		console.log(result);
	});

	// ping mock mocked
	micro.act({topic: 'system', cmd: 'pingmocked'}, (ans, result)=>{
		console.log(result);
	});

	// ping mock procedured
	micro.act({topic: 'system', cmd: 'pingprocedured'}, (ans, result)=>{
		console.log(result);
	});

	// ping auto procedured
	micro.act({topic: 'system', cmd: 'pingautoprocedured'}, (ans, result)=>{
		console.log(result);
	});

	// ping auto dispatcher
	micro.act({topic: 'other', cmd: 'pingdispatcher'}, (ans, result)=>{
		console.log(result);
	});

});
