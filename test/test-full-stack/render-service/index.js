const micro = require('../../../index.js').create();

//  - Reducer for user'
micro.addRenders([
	{
		models: ['user'],
    action: 'user_create',
    run: function(event, cb) {
			this.models.user.create({
				id: event.eventNumber,
				name: event.data.name,
				login: event.data.login,
				password: event.data.password
			}).save(cb);
    },
	}
]).start();
