const deb = {
  load: ['env'],
  deb: function(obj) {
    if(this.load.env.debug)
      console.log(obj);
  },
};

module.exports = deb;
