//micro.tagger = require('./tagger.js');
//micro.evt = require('./evt.js').create(uuidv1, fetch, micro.env);
//micro.dispatcher = require('./dispatcher.js').create(micro.evt);
//micro.eventStore = require('event-store-client');
//micro.streamListener = require('./streamListener.js').create(micro.env, micro.eventStore);
//micro.confirmer = require('./confirmer.js').create(micro.tagger, micro.streamListener);
// simpler functions

const Hemera = require("nats-hemera");
const micro = {};
// default env
micro.env = require('./lib/env.js');
micro.modules = require('./lib/modules');

micro.create = (env=null) => {
  if(env)
    micro.env = { ...micro.env, env};
  micro.hemera = new Hemera(
    require("nats").connect({
      'url': micro.env.nats_url,
      'user': micro.env.nats_user,
      'pass': process.env.nats_pw
    }),
    { logLevel: micro.env.hemera_logLevel }
  );
  micro.hemera_add_array = [];
  return micro;
};

micro.mock = (req, cb, procedure, mocked_data) => {
  if(micro.env.mock)
    cb(null, mocked_data);
  else
    micro.procedures[procedure].run(req, cb);
};

micro.procedures = {};

micro.addProcedures = (procedures) => {
  procedures.forEach(procedure=>{
    micro.addProcedure(procedure);
  });
  return micro;
};

micro.addProcedure = (procedure) => {
  procedure = micro.completeConfigForProcedure(procedure);
  procedure = micro.loadModules(procedure);

  micro.procedures[procedure.name] = procedure;
  micro.autoAdd(procedure);

  return micro;
};

// autocomplete config with defaults
micro.completeConfigForProcedure = (procedure) => {

  if(procedure.rules == null || procedure.rules == undefined)
    procedure.rules = null;

  if(procedure.load == null || procedure.load == undefined)
    procedure.load = [];

  if(procedure.auto_add == null || procedure.auto_add == undefined)
    procedure.auto_add = true;

  if(procedure.topic == null || procedure.topic == undefined)
    procedure.topic = 'system';

  if(procedure.mocked == null || procedure.mocked == undefined)
    procedure.mocked = {};

  return procedure;
}

micro.loadModules = (procedure) => {
  if( procedure.load != undefined && procedure.load != null ) {
    if( procedure.load instanceof Array ) {
      const modules = {};
      procedure.load.forEach( module_name => {
        const module = micro.modules[module_name]();
        modules[module_name] = micro.loadModules(module);
      });
      procedure.load = modules;
    }
  }
  return procedure;
};

// auto add procedures
micro.autoAdd = (procedure) => {
  if(procedure.auto_add) {
    micro.add({topic: procedure.topic, cmd: procedure.name}, (req, cb) => {
      return micro.mock(req, cb, procedure.name, procedure.mocked);
    });
  }
};

// add
// { topic: "math", cmd: "add" }, async function (resp) {
//   return resp.a + resp.b
// }
micro.add = (pin, func) => {
  micro.hemera_add_array.push({pin, func});
  return micro;
};

micro.start = (main=null) => {
  micro.hemera.ready(async () => {
    for(add_line of micro.hemera_add_array)
      micro.hemera.add(add_line.pin, add_line.func);
    if(main)
      main();
  });
  return micro;
};

// action
// { topic: "math", cmd: "add", a: 1, b: 2 }
micro.act = (action, cb) => {
  micro.hemera.act(action, cb);
  return micro;
};

module.exports = micro;
