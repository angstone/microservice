const dummy_person = {
	login: 'luansilas',
	name: 'Luan Ribeiro',
	password: '12345678',
	password_confirmation: '12345678'
};

const micro = require('../../../index.js').create().start(()=>{
	setInterval(()=>{
		console.log('Asking user creation..');
		micro.act({ action: 'user_create', data: dummy_person }, (err, res)=>{
			console.log('User creation awnser:');
			if(err) {
				console.log('CREATION ERROR:');
				console.log(err.message);
			}
			else {
				console.log('CREATION SUCCESS:');
				console.log(res);
				console.log('ASKING INFORMATION ABOUT JUST ADDED USER VIA USER VIEW AFTER 10 SECONDS');
				setTimeout(()=>{
					micro.view({vent:'users', id: res.id}, (err, res) => {
						if(err) {
							console.log('VIEW USER ERROR:');
							console.log(err);
						}
						else {
							console.log('VIEW USER SUCCESS:');
							console.log(res);
						}
					});
				}, 1000);
			}
		});
	}, 5000);
});
