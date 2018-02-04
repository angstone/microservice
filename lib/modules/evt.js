const evt = {
  load: ['uid', 'fetch', 'env'],
  send: function(type) { this._type = type; return this; },
  with: function(payload) { this._payload = payload; return this; },
  to: function(to) { this._to = to; return this; },
  then: function(cb) {
    const url = this.load.env.es_gateway+'/streams/'+this._to;
    const method = 'POST';
    const body = JSON.stringify([{
      eventId: this.load.uid(),
      eventType: this._type,
      data: this._payload
    }]);
    const headers = { 'Content-Type': 'application/vnd.eventstore.events+json' };

    this.load.fetch(url, {method, headers, body})
      .then(function(res) {
        if(res.status==201)
          cb(null, body);
        else
          cb(res, null);
	    }).catch(function(err) {
        cb(err, null);
      });
  }
};

module.exports = evt;
