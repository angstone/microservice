const micro = require('../../../index.js').create();
const data = {
	generic_field: 'generic data',
	anything: 'anoying data'
};

micro.start(()=>{
	console.log('Dispatching an event and looking for confirmation:');

	// dispatch_and_confirm
	micro.act({topic: 'test', cmd: 'dispatch_and_confirm', data}, (err, res)=>{
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
	micro.act({topic: 'test', cmd: 'dispatch_and_fail', data}, (err, res)=>{
		if(err) {
			console.log('DISPATCH AND FAIL ERROR:');
			console.log(err.message);
		}
		else {
			console.log('DISPATCH AND FAIL SUCCESS:');
			console.log(res);
		}
	});

	// dispatch_and_confirm_auto
	micro.act({topic: 'test', cmd: 'dispatch_and_confirm_auto', data}, (err, res)=>{
		if(err) {
			console.log('DISPATCH AND CONFIRM AUTO ERROR:');
			console.log(err.message);
		}
		else {
			console.log('DISPATCH AND CONFIRM AUTO SUCCESS:');
			console.log(res);
		}
	});

});
