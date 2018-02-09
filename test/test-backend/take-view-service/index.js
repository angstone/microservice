const micro = require('../../../index.js').create();
const data = {
	in: 'generic',
	by: 'anoying_data',
	id: 'any'
};
micro.addView('generic', (what, cb) => {
	cb(null, {
		another_data: 'anoyng_other_data',
		got_in_id: what.id
	});
});
micro.start(()=>{
	console.log('Taking a View:');

	// dispatch_and_confirm
	micro.view(data, (err, res)=>{
		if(err) {
			console.log('VIEW ERROR:');
			console.log(err);
		}
		else {
			console.log('VIEW SUCCESS:');
			console.log(res);
		}
	});

});
