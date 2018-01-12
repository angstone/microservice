const Hemera = require("nats-hemera");
//const uuidv1 = require('uuid/v1');
//const fetch = require('node-fetch');

const micro = {};
// default env
micro.env = require('./lib/env.js');

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

//add
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

//action
// { topic: "math", cmd: "add", a: 1, b: 2 }
micro.act = (action, cb) => {
  micro.hemera.act(action, cb);
  return micro;
};

module.exports = micro;
