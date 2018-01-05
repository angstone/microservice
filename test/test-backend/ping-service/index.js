const micro = require('../../../index.js');

//micro.setBase();

micro.start();

micro.seneca.act('role:system, cmd:ping', (err, result) => {
	if(err)
		console.log(err);
	else
		console.log(result);
});
