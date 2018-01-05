//const uuidv1 = require('uuid/v1');
//const fetch = require('node-fetch');

const micro = {};

// default env
micro.env = require('./lib/env.js');

micro.seneca = require('seneca')();
micro.listen_pin_array = [];

//micro.env = require('../env.js');
//micro.tagger = require('./tagger.js');
//micro.evt = require('./evt.js').create(uuidv1, fetch, micro.env);
//micro.dispatcher = require('./dispatcher.js').create(micro.evt);
//micro.eventStore = require('event-store-client');
//micro.streamListener = require('./streamListener.js').create(micro.env, micro.eventStore);
//micro.confirmer = require('./confirmer.js').create(micro.tagger, micro.streamListener);
// simpler functions
//micro.mock = (procedure, mocked) => {
  //if(micro.env.MOCK)
    //mocked();
  //else
    //procedure.start();
//}

micro.useEnv = (env=null) => {
  if(env)
    micro.env = { ...micro.env, env};
  return micro;
};

micro.consume = (pin) => {
  micro.listen_pin_array.push({ pin });
  return micro;
};

micro.observe = (pin) => {
  micro.listen_pin_array.push({ pin, model: 'observe' });
  return micro;
};

micro.setBase = (port=null) => {
  micro.env.mesh_is_base = true;
  if(port)
    micro.env.mesh_port = port;
  return micro;
}

micro.start = () => {

  micro.seneca.use('consul-registry', {
    host: micro.env.mesh_consul_registry_host
  });

  const cfg = {
    isbase: micro.env.mesh_is_base,
    discover: {
      registry: {
        active: true
      },
      multicast: {
        active: false
      }
    }
  };

  if(micro.env.mesh_is_base) {
    cfg.isbase = true;
    cfg.port = micro.env.mesh_port;
  }

  if(micro.listen_pin_array.length > 0)
    cfg.listen = micro.listen_pin_array;

  micro.seneca.use('mesh', cfg);
  return micro;
};

module.exports = micro;
