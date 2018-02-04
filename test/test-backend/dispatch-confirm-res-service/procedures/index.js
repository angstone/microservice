const procedures = [
  {
    topic: 'test',
    name: 'dispatch_and_confirm',
    load: ['dispatcher', 'confirmer'],
    run: function(req, cb) {
      const op = {
        type: 'dispach_test',
        stream: 'tests',
        payload: req.data
      };
      //dispatch
      this.load.dispatcher.dispatch(op, (err, evt) => this.afterDispatch(err, evt, op, cb) );
    },
    afterDispatch: function(err, evt, op, cb) {
      if(err)
        return cb(err, null);
      this.load.confirmer.confirm(op, (err, evt) => this.afterConfirm(err, evt, op, cb) );
    },
    afterConfirm: function(err, evt, op, cb) {
      if(err)
        return cb(err, null);
      //confirm
      op.evt = evt;
      return cb(null, op);
    },
  },
];

module.exports = procedures;
