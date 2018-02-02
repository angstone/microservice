# @angstone/microservice

Default microservice package for angstone services.

Not ready for production!


## Engineering Aspects

* All modules are stateless.
* All modules must have its dependencies loaded in an exclusive entity.
* All submodules has its dependencies loaded in an exclusive entity also ad infinitum.

## Usage

```npm install -S @angstone/microservice```

## Sample

### Consume

```
const env = {
  //opts
};

const micro = require('@angstone/microservice').create(/*env*/).start(()=>{

	// consume
	micro.act({topic: 'system', cmd: 'ping'}, (err, result)=>{
		console.log(result);
	});

	// consume sending data as json
  const data = {
    par1: 'any',
    par2: 123
  };
	micro.act({topic: 'system', cmd: 'operate_pars', data}, (err, result)=>{
    if(err!=null)
		  console.log(result);
    else
      console.log({error: err})
	});

});
```

### Serve

```
const micro = require('@angstone/microservice').create().addProcedure({
	topic: 'system', //optional default: system
	name: 'operate_pars',
	rules: require('../rules/operate_rules'), //optional default: null
	load: ['dispatcher'], //optional default: []
	procedure: require('./operate-procedure.js'),
	mocked: { //optional default: null
		ans1: 'Mocked Ans1',
		ans2: '321'
	},
}).start();
```
