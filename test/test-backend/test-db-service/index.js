const dummy_person = {
	name: 'Garibaldo Alcântara',
	sexo: 'Femenina Veneno',
	idade: 'Fazendo Hora Extra',
};

console.log('_______ TESTING DATABASE: ________');


// create a person table

// insert dummy_person

// verify and throw dummy_person

console.log('pronto para cospir a pessoa dummal');

let count = 0;
const starting_time = 3;

const start = () => {

		const thirdPhase = (id) => {
			console.log('try to read dummy_person');
			client.get({
				index: 'dummy',
			  type: 'person',
			  id
			}, function (error, response) {
				if (error) {
					console.error('elasticsearch error while reading dummy person:');
			    console.error(error);
			  } else {
					console.log('All right reading dummy person in elastic');
			    console.log(response);
					console.log('________ THATS ALL FOLKS! ________')
			  }
			});
		};

		const secondPhase = () => {
			console.log('try to write dummy_person');
			client.index({
			  index: 'dummy',
			  type: 'person',
			  body: dummy_person
			}, function (error, response) {
				if (error) {
					console.error('elasticsearch error while writing dummy person:');
			    console.error(error);
			  } else {
					console.log('All right writing dummy person in elastic!');
			    console.log(response);
					thirdPhase(response._id);
			  }
			});
		};

		console.log('carregar o plugin elasticsearch');
		var elasticsearch = require('elasticsearch');

		console.log('initialize client');
		var client = new elasticsearch.Client({
		  host: 'elasticsearch:9200',
		  log: 'trace'
		});

		console.log('try a ping');
		client.ping({
		  requestTimeout: 30000,
		}, function (error) {
		  if (error) {
		    console.error('elasticsearch cluster is down!');
		  } else {
		    console.log('All is well');
				secondPhase();
		  }
		});

};

const intervalId = setInterval(()=>{
	count++;
	if( count == starting_time ){
		start();
	} else if (count<starting_time) {
		console.log('this is a 5 seconds pulse');
	}
}, 5000);
