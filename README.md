# @angstone/microservice

Default microservice package for angstone services.

You can use this to build microservice in an unbelievable easy way!

Not ready for production!
![alt text](https://github.com/angstone/microservice/blob/master/angstone_microservice_simple.jpg)

## Dependencies

- Docker 17+
- docker-compose
- npm
- nvm would be nice

## Engineering Aspects

* It contains 'eventstore' and all data are event-sourced by default.
* It works like this:

- An action is asked by your endpoint api.

- The action get the auth information by the auth microservice.

- The action is pre-filtered by dinamic business rules.

- The business rules are writen in a separated file and It is common to all microservices.

- The event is dispatched to EventStore

- The event walk throw the 'confirmers' microservices. Note that the reducers take the business
rules again to confirm the events, so the event is always double checked to improve reliability.

- The confirmation or error event is dispatched.

- The microservice than takes the confirmation or error and return to your endpoint api.

- The confirmation event go to 'reducers'.

- The reducers translate only the confirmed events in a set of changes in the database (Elastic Search).

- The views are used to retrieve and querry data. They are consumed by your endpoint api's.

* All modules must have its dependencies loaded in an exclusive entity.
* All submodules has its dependencies loaded in an exclusive entity also ad infinitum.

* Modules we got so far:

- toucher : simply test module loader utility.
- deb : used to debug modules and code.
- error : generate errors.
- evt : set of shortcuts to generate and configure events.
- tagger : utility to generate and manipulate tags that make the 'type' of the event.
- dispatcher : dispatch the events.
- streamListener : listen to events.
- confirmer : take events confirmeds by reducers.
- reducer : utility to make reducers (take the event and perform confirm based on business rules and updated views).
- render: utility to make renders (take the event and perform changes in DB following business rules and using the updated views).
- db: Allow access to elasticsearch in a easy way (used by the views).
- view : utility to create a view (querry data from DB).
- operator : shortcut to perform the dispatch and confirmation operation.

## Install

```npm install -S @angstone/microservice```

# Work on this project

If you want to perform tests or work in this project you need to grant the scripts files in scripts folder the execution privilege!

```git clone http://github.com/angstone/microservice```
```cd microservice```
```nvm use```
```npm install```
```sudo chmod +x scripts/*```

## Testing

```npm test```

```npm run test``` or  ```npm run test-full-stack```

```npm run test-backend```


* 'DISPATCH AND FAIL ERROR' is normal because It is supposed to do exactly this (FAIL).

If you change the backend testing dockers or get troubles with the second time
you  perform 'npm test' you may want to use:

```npm run reborn```
```npm run reborn-backend```

## Usage

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
      console.log({error: err});
  });
});
```

### Serve

```
const micro = require('@angstone/microservice').create().addProcedure({
  topic: 'system', //optional default: system
  name: 'operate_pars',
  rules: require('../rules/operate_rules'), //optional default: null
  load: ['toucher'], //optional default: []
  run: function(req, cb) {
    // pre-validate sample
    // this.err = this.load.rules.pre_validation(this.op);
    // if(this.err) return cb(this.err, null);

    // the modules declared in load as string are automatic loaded
    console.log(this.load.toucher.touch()); // the toucher module is for testing autoload utility

    cb(null, {
      name: req.data.name, // req.data will be the request data passed in the consume function
      data: req.data.data
    });
  },
  mocked: { //optional default: null
    ans1: 'Mocked Ans1',
    ans2: '321'
  },
}).start();
```
