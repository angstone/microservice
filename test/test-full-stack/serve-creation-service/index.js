const micro = require('../../../index.js').create();

//  - Serve user creation'
micro.addOperator({
	resource: 'users',
	action: 'create'
}).start();
