const ping_procedure = {

  create: function(ping_rules) {
    //this.micro = micro;
    this.ping_rules = ping_rules;
    //this.req = req;
    //this.cb = cb;
    //this.op = {
    //  type: 'ping',
    //  stream: 'system',
    //  payload: req,
    //};
    //this.err = false;
    return this;
  },

  start: function(req, cb) {
    cb(null, {result: 'pong procedured'});
  },

};

module.exports = ping_procedure;
