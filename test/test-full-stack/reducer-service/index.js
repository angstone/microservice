const micro = require('../../../index.js').create();

//  - Reducer for user'
micro.addReducers([
	{
		stream: 'users',
    type: 'create',
    run: function(event, cb) {
			cb(null, event.data);
    },
	}
]).start();
