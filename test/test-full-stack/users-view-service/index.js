//  - Serve users View'
const micro = require('../../../index.js').create();

micro.addViews([{
	resource: 'users',
	sights: {
		id: function(pars, db, cb) {
			db.get({
				table: 'users',
				id: pars.id
			}, cb);
		}
	}
}]).start();
