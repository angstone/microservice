const ping_dispatcher_procedure = {

  create: function(load) {
    this.load = load;
    return this;
  },

  start: function(req, cb) {
    this.load.dispatcher.touch( (err, res) => {
      if(err) cb(err, null);
      cb(null, {result: 'pong dispatched'});
    } );
  },

};

module.exports = ping_dispatcher_procedure;
