const dummy_person = {
	name: 'Garibaldo Alcântara',
	sexo: 'Femenina Veneno',
	idade: 'Fazendo Hora Extra',
};

const micro = require('../../../index.js').create();

//  - Ask creation of a user 'dummy_person'
micro.start(()=>{

	setInterval(()=>{

		console.log('Asking user creation..');
		micro.act({ resource: 'users', action: 'create', data: dummy_person }, (err, res)=>{
			if(err) {
				console.log('CREATION ERROR:');
				console.log(err.message);
			}
			else {
				console.log('CREATION SUCCESS:');
				console.log(res);

				console.log('ASKING INFORMATION ABOUT JUST ADDED USER VIA USER VIEW AFTER 10 SECONDS');

				setTimeout(()=>{
					micro.view({resource:'users', id: res.id}, (err, res) => {
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
