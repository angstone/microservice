module.exports = {
  load: ['db','add'],
  addView: function(view, func) {
    this.load.add({topic: 'view_'+view, cmd: 'take'}, (req, cb)=>{
      const what = req.data;
      if(!what.by)
        what.by = 'id';
      return func(what, this.load.db, cb);
    });
  },
};

/*
view.take({
  in: 'auth',
  by: 'login',
  id: op.payload.login,
  password: op.payload.password
}, cb);
*/
