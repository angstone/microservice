const ping_procedure = {

  create: function(load) {
    this.load = load;
    return this;
  },

  start: function(req, cb) {
    cb(null, {result: 'pong procedured'});
  },

};

module.exports = ping_procedure;
