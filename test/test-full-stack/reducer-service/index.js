const micro = require('../../../index.js').create();

//  - Reducer for user'
micro.addReducers([
	{
		resource: 'users',
    action: 'create',
    run: function(event, cb) {
			cb(null, event.data);
    },
	}
]).start();
