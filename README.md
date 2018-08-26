[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)


# DEPRECATED
This is no longer supported, please consider using @angstone/micro instead.

https://github.com/angstone/micro

# @angstone/microservice

ANGSTONE Microservices Framework.

The Backend Framework I Allways dream't about!

Imagine be able to build your backend:
- event-sourced
- in-memory db performance
- or mongodb adapter
- with built-in microservices discovery system
- in a standard team shared framework
- a modular framework by the way
- with many built-in modules that facilitates your life like 'auth'
- all errors and logs handled in a consistent way across microservices
- and in an unbelievable easy way!

Not ready for production!

This encapsulates HemeraJS package witch encapsulates nats to create an magic framework

## Dev-Dependencies

- npm
- nvm would be nice
- plantuml would be very good also
* DOCKER - you need docker and need to follow post-installation steps (you should be able to run 'docker ps' as current user)
- docker-compose
* NATS - will be installed with npm
* EVENTSTORE - docker will be downloaded and started automatically when using npm test

## To Install:

```git clone http://github.com/angstone/microservice```

```npm i```

## Documentation

For now we have schemas in docs that you can access with your plantuml tool.

Working in a docusaurus...

you can basically do this in order to create a webservice:

```
// You should setup the configuration like this:

const env = { nats_url:'http://localhost:2113', ... };

// All the setup configuration can be set as environment variables like NATS_URL as well
// so you can pass nothing instead of env

const micro = require('@angstone/microservice')(env);

// Now you can add providers like:

micro.add('command name', (request_payload_object, cb)=>{
  cb(err, response);
});

// Or complex ones that uses built-in or external modules like:

micro.addProcedure({
  load: ['the_name', 'of_the_modules', 'you_whant_to_load', 'auth', 'error', 'add'],
  start: async function() {

    this.load.error.throwFatal(this.load.error.commonTypes.UNKNOWN, 'THIS WILL THROW A FATAL ERROR');

    const some_amazing_important_stuff = await this.load.the_name.functionProvidedByModule('function_args');

    this.load.add('command name', (request_payload_object, cb)=>{
      const response = this.load.you_whant_to_load(request_payload_object);
      cb(err, respose);
    });

    await this.load.of_the_modules.otherFunction(some_amazing_important_stuff);
  },
});

// Then you just need to start, but maybe you want to perform some after-start tasks..
micro.start(()=>{
  console.log('amazing log');

  // or even better:
  micro.modules.logger.info('server started');

  // so finally you can ask for the service added:
  // you CAN and WANT to do it in other microservice
  // that can be in other docker in other server in other country...
  micro.act('command name', {
    javascript_object: 'or omit the second argument if there is no request data'
  }, (err, res)=>{
    if(err) micro.modules.error.handle(err); // or handle it like you want
    doAmazingStuffWithDataProvidedByService(res);
  });  

});

```

Look at the samples folder for understand it better for while..

But could you ever imagine create a microservice for your backend application like this:

```
require('@angstone/microservice')().add('multiply two numbers', (req, cb)=>{
  cb(null, req.first+req.second);
}).start();
```

And consumes like this:
```
require('@angstone/microservice')().act('multiply two numbers', { first: 5, second: 3 }, (err, res)=>{
  if(!err) console.log(res); // we expect 15 here
}).start();
```
?

But you can also use this for create the service:

```
require('@angstone/microservice')().addProcedure({
  load:['commander'],
  start: ()=>{
    this.load.commander.addCommand('multiply two number', require('./rules/multiply_two_numbers_rule'));
    // so you can provide a js file with complex rules that loads
    // models and modules and respond complex data manipulation
    // all event sourced, using built-in logic abstractions
    // look for the plantuml schemas in order to understand this magic
  }
}).start();
```

### To be tested

```sudo chmod +x scripts/*```

```npm test```

Modules:

* util : many simple functions
* error : generate errors and handle errors in on place.
* evt : set of shortcuts to generate and dispatch events commands.
* dispatcher : dispatch the commands.
* logger : one place for logs
* ruler : generate the business rule object based on business rule sheet Javascript Object
* commander : the module used to declare a command along with your business rule object
* config-server : set and get server configuration. This one is used to share the config across many microservices and provide help for self discovery engine. allows to set other microservices configuration in one place
* rest-portal : simple example of restportal for access microservices
* auth (on going work to provide built-in authentication)

## To Do

* include module called loader
* make ruler and modeler loads automatically the modules using module loader
* create test cases for those

* define what exactly the auth will support
* write business rules for auth in pseudocode
* rewrite plantuml for auth based in new plantuml workflow
* start the documentation of angstone with docusaurus
* document completely the auth module
* implement auth



## Engineering Aspects

* It contains 'eventstore' and all data are event-sourced by default.
* It works like this:

- The business rules are writen in a separated file and It is common to all microservices.

- An action is asked by your endpoint api.

- The action get the auth information by the auth microservice.

- The action is pre-filtered by dinamic business rules.

- The event is dispatched to EventStore

- The confirmation event go to 'reducers'.

- The reducers translate events in a set of changes in the models (in memory using TAFFY).

- The views are used to retrieve and querry data from models. They are consumed by your endpoint api's.

* All modules must have its dependencies loaded in an exclusive entity (new instance) or shared (singleton).
The moduler loader take cares of declare the modules and it kind (singleton or newinstance)

* All submodules has its dependencies loaded in same way also ad infinitum.
