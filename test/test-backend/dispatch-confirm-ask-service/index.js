const micro = require('../../../index.js').create();

micro.start(()=>{
	console.log('Dispatching an event and looking for confirmation:');

	// dispatch_and_confirm
	micro.act({topic: 'test', cmd: 'dispatch_and_confirm', data: 'stuff'}, (err, res)=>{
		if(err) {
			console.log('DISPATCH AND CONFIRM ERROR:');
			console.log(err);
		}
		else {
			console.log('DISPATCH AND CONFIRM SUCCESS:');
			console.log(res);
		}
	});

	// dispatch_and_fail
	micro.act({topic: 'test', cmd: 'dispatch_and_fail', data: 'stuff'}, (err, res)=>{
		if(err) {
			console.log('DISPATCH AND FAIL ERROR:');
			console.log(err.message);
		}
		else {
			console.log('DISPATCH AND FAIL SUCCESS:');
			console.log(res);
		}
	});

});
