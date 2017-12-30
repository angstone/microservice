//const uuidv1 = require('uuid/v1');
//const fetch = require('node-fetch');

let micro = {};

// default env
micro.env = {

  redis: {
    host: 'localhost',
    port: 6379
  },

  seneca_redis_config: {
    ...this.redis,
    type:'redis'
  },

};

micro.seneca = require('seneca')().use('seneca-redis-transport');
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

micro.start = () => {
  const cfg = micro.env.seneca_redis_config;
  micro.seneca.client(cfg).listen(cfg);
  return micro;
};

micro.useEnv = (env=null) => {
  if(env)
    micro.env = { ...micro.env, env};
  return micro;
};

module.exports = micro;
