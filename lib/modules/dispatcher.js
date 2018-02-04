const dispatcher = {
  load: ['evt'],
  dispatch: function(op, cb) {
    this.load.evt.send(op.type).with(op.payload).to(op.stream).then(cb);
  },
};

module.exports = dispatcher;
