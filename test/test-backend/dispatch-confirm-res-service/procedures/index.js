const procedures = [
  {
    topic: 'test',
    name: 'dispatch_and_confirm',
    load: ['dispatcher', 'confirmer'],
    run: function(req, cb) {
      const op = {
        type: 'dispatch_test',
        stream: 'tests',
        payload: req.data
      };
      //dispatch
      this.load.dispatcher.dispatch(op, (err, evt) => this.afterDispatch(err, evt, op, cb) );
    },
    afterDispatch: function(err, evt, op, cb) {
      if(err)
        return cb(err);
      op.evt = evt;
      this.load.confirmer.confirm(op, (err, evt) => this.afterConfirm(err, evt, op, cb) );
    },
    afterConfirm: function(err, evt, op, cb) {
      if(err)
        return cb(err);
      return cb(null, op);
    },
  },
  {
    topic: 'test',
    name: 'dispatch_and_fail',
    load: ['dispatcher', 'confirmer'],
    run: function(req, cb) {
      const op = {
        type: 'dispatch_test_force_fail',
        stream: 'tests',
        payload: req.data
      };
      //dispatch
      this.load.dispatcher.dispatch(op, (err, evt) => this.afterDispatch(err, evt, op, cb) );
    },
    afterDispatch: function(err, evt, op, cb) {
      if(err)
        return cb(err);
      op.evt = evt;
      this.load.confirmer.confirm(op, (err, evt) => this.afterConfirm(err, evt, op, cb) );
    },
    afterConfirm: function(err, evt, op, cb) {
      if(err)
        return cb(err);
      return cb(null, op);
    },
  },
  {
    topic: 'test',
    name: 'dispatch_and_confirm_auto',
    load: ['operator'],
    run: function(req, cb) {
      const op = {
        type: 'dispatch_test',
        stream: 'tests',
        payload: req.data
      };
      //dispatch
      this.load.operator.operate(op, cb);
    }
  },
];

module.exports = procedures;
