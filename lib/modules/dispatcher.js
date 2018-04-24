const dispatcher = {
  load: ['evt'],
  dispatch: function(op, cb) {
    this.load.evt.send(op.action).with(op.data).to(op.resource).then(cb);
  },
};

module.exports = dispatcher;
