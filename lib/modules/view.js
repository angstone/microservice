module.exports = {
  load: ['micro'],
  view: function(what, cb) {
    this.load.micro.act({topic: 'view_'+what.in, cmd: 'take', data: what}, cb);
  },
  addView: function(view, func) {
    this.load.micro.add({topic: 'view_'+view, cmd: 'take'}, (req, cb)=>{
    	return func(req.data, cb);
    });
  }
};

/*
view.take({
  in: 'auth',
  by: 'login',
  id: op.payload.login,
  password: op.payload.password
}, cb);
*/
