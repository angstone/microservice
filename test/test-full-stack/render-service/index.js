const micro = require('../../../index.js').create();

//  - Reducer for user'
micro.addRenders([
	{
		stream: 'users',
    type: 'create',
    run: function(event, cb) {
			this.load.db.index({
		    table: 'users',
		    id: event.eventNumber,
		    data: event.data
		  }, cb);
    },
	}
]).start();
