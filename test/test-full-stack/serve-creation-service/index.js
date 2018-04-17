const micro = require('../../../index.js').create();

//  - Serve user creation'
micro.addProcedure({
	topic: 'users',
	name: 'create',
	load: ['operator'],
	run: function(req, cb) {
		const op = {
			stream: 'users',
			type: 'create',
			payload: req.data
		};
		// operate event
		this.load.operator.operate(op, cb);
	}
}).start();
