module.exports = {
  load: ['env'],
  start: function() {
		this.remakeClient();
    return this;
  },
  remakeClient: function() {
    if(this.client)
      this.client.close();

    this.options = {
      hosts: this.load.env.elastic_hosts,
      log: this.load.env.elastic_log,
      pingTimeout: this.load.env.elastic_pingTimeout,
		  ssl: this.load.env.elastic_ssl,
		};
    if(this.load.env.elastic_httpAuth != null)
      this.options.httpAuth = this.load.env.elastic_httpAuth;

    // Load plugin elasticsearch
		this.elasticsearch = require('elasticsearch');

    // Initialize client
    this.client = new this.elasticsearch.Client(this.options);
  },
  ping: function(cb) {
    this.client.ping({}, function (err) {
		  if (err)
		    cb(err, null);
		  else
        cb(null, 'pong');
		});
  },
  index: function(req, cb) {
    const index_req = {
      index: req.index || 'db',
      type: req.table || 'system',
      body: req.data
    };
    if(req.id)
      index_req.id = req.id;
    console.log(index_req);
    this.client.index(index_req, (err, res) => {
      if(this.load.env.debug)
        console.log(res);
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
      if(this.load.env.debug)
        console.log(res);
      cb(err, res);
    });
  }
};
