//  - Serve users View'
const micro = require('../../../index.js').create();

micro.addView('users', function(pars, db, cb) {
	if(pars.by=='id') {
		db.get({
			table: 'users',
			id: pars.id
		}, cb);
	} else {
		console.log(pars);
		cb('INTERNAL ERROR: UNKNOWN WAY OF VIEW', null);
	}
}).start();
