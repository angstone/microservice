# @angstone/microservice

Default microservice package for angstone services.

You can use this to build microservice in a unbelievable easy way!

Not ready for production!

## Dependencies

- Docker 17+
- docker-compose
- npm
- nvm would be nice

## Engineering Aspects

* It contains a eventstore and all data are event-sourced by default.
* It works like this:

- An event is dispatch by your endpoint api.

- The event get the auth information by the auth microservice.

- The event is pre-filtered by dinamic business rules, which is writen in a separeted,
 file and is common to all microservices.

- The event is dispatched to EventStore

- The event walk throw the 'reducers' microservices. They translate the event in a set of changes to views
-- Note that the reducers take the business rules again to confirm the events, so the event is always double checked
 to improve reliability.

- After applying change to views (database {Elastic Search}), a confirmation or error event is dispatched.

- The microservice than takes the confirmation or error and return to your endpoint api.

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
- reducer : utility to make reducers (take the event and perform changes in DB following business rules).
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

* 'DISPATCH AND FAIL ERROR' is normal because It is supposed to do exactly this (FAIL).

If you change the backend testing dockers or get troubles with the second time
you  perform 'npm test' you may want to use:

```npm run reborn```

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
