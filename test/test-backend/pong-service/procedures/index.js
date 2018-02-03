const procedures = [
  {
    name: 'ping',
    auto_add: false,
    run: (req, cb) => {
      cb(null, {result: 'pong procedured'});
    },
  },
  {
    name: 'pingautoprocedured',
    run: function(req, cb) {
      cb(null, {result: 'pong procedured'});
    },
  },
  {
    topic: 'other',
    name: 'pingtoucher',
    load: ['toucher'],
    run: function(req, cb) {
      this.load.toucher.touch((err, res)=>{
        if(err) cb(err, null);
        cb(null, {result: 'pong '+res});
      });
    },
  },
];

module.exports = procedures;
