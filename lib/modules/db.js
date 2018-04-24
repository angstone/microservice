module.exports = {
  load: ['env', 'error'],
  start: function() {
		this.remake();
    return this;
  },
  remake: function() {
    this.ready = false;

    if(this.mongoose)
      //if(this.mongoose.connection)
      //  this.mongoose.connection.close(true);
      this.mongoose = null;

    this.mongoose = require('mongoose');
    this.mongoose.connect(this.load.env.mongodb_host+'db');

    this.mongoose.connection.once('open', () => {
      if(this.load.env.debug) console.log('MONGOOSE CONNECTED');
      this.ready = true;
    });

    this.mongoose.connection.on('disconnected', () => {
      if(this.load.env.debug) console.log('MONGOOSE DISCONNECTED. REMAKING..');
      this.ready = false;
      this.remake();
    });

    this.mongoose.connection.on('error', (err) => {
      console.error.bind(console, 'MONGODB CONNECTION ERROR:');
      console.log(err);
    });
  },
  ping: function(cb) {
    this.do((err, db) => {
      cb(err, err ? null : 'pong');
    });
  },
  do: function(cb) {
    if(this.ready)
      cb(null, this);
    else {
      setTimeout(() => {
        if(this.ready)
          cb(null, this);
        else {
          setTimeout(() => {
            if(this.ready)
              cb(null, this);
            else
              cb(this.load.error('DB DISCONNECTED'), null);
          }, 100);
        }
      }, 10);
    }
  },
  schema: function(schema, config) {
    return this.mongoose.Schema(schema, config);
  },
  model: function(name, schema) {
    return this.mongoose.model(name, schema);
  },
  dropMany: function(dbs, cb) {
    let db = dbs.pop();
    this.mongoose.connection.db.dropCollection(db, err=>{
      if(err) {
        if( !( err.codeName && (err.codeName=='NamespaceNotFound') ) ) return cb(err);
        else if(dbs.length>0) this.dropMany(dbs, cb);
        else cb(null);
      } else if(dbs.length>0) this.dropMany(dbs, cb);
      else cb(null);
    });
  },
  /*
  index: function(req, cb) {
    const index_req = {
      index: req.index || 'db',
      type: req.table || 'system',
      body: req.data
    };
    if(req.id)
      index_req.id = req.id;
    this.client.index(index_req, (err, res) => {
      if(this.load.env.debug) console.log(res);
      cb(err, res);
    });
  },
  get: function(req, cb) {
    const get_req = {
      index: req.index || 'db',
      type: req.table || 'system',
      id: req.id
    };
    this.client.get(get_req, (err, res) => {
      if(this.load.env.debug) console.log(res);
      if(err) {
        cb(err, null);
      }
      else {
        const _res = {
          table: res._type,
          id: res._id,
          data: res._source
        };
        cb(null, _res);
      }
    });
  },
  */
};
