const operator = {
  load: ['dispatcher', 'confirmer'],
  operate: function(op, cb) {
    if( op.need_confirmation==null || op.need_confirmation==undefined )
      op.need_confirmation = true;
    this.load.dispatcher.dispatch(op, (err, evt) => this.afterDispatch(err, evt, op, cb) );
  },
  afterDispatch: function(err, evt, op, cb) {
    if(err)
      return cb(err);
    op.evt = evt;
    if(op.need_confirmation)
      this.load.confirmer.confirm(op, (err, evt) => this.afterConfirm(err, evt, op, cb) );
    else
      return cb(null, op);
  },
  afterConfirm: function(err, evt, op, cb) {
    if(err)
      return cb(err);
    return cb(null, op);
  },
};

module.exports = operator;