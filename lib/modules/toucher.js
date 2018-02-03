const toucher = {
  load: ['uid'],
  touch: function(cb) {
    cb(null, 'touched: '+this.load.uid());
  },
};

module.exports = toucher;
