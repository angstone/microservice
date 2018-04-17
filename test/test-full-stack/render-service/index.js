const micro = require('../../../index.js').create();

//  - Reducer for user'
micro.addRenders([
	{
		resource: 'users',
    action: 'create',
    run: function(event, db, cb) {
			db.index({
		    table: 'users',
		    id: event.eventNumber,
		    data: event.data
		  }, cb);
    },
	}
]).start();
