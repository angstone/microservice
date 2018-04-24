const micro = require('../../../index.js').create();

//  - Serve user creation'
micro.addOperator({
	action: 'user_create'
}).start();
