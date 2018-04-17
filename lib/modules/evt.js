const evt = {
  load: ['uid', 'fetch', 'env'],
  send: function(type) { this._type = type; return this; },
  with: function(payload) { this._payload = payload; return this; },
  to: function(to) { this._to = to; return this; },
  then: function(cb) {
    const url = this.load.env.es_gateway+'/streams/'+this._to;
    const method = 'POST';
    const event_data = {
      eventType: this._type,
      eventId: this.load.uid(),
      data: this._payload
    };
    const body = JSON.stringify([event_data]);
    const headers = { 'Content-Type': 'application/vnd.eventstore.events+json' };
    this.load.fetch(url, {method, headers, body})
      .then(function(res) {
        if(res.status==201) {
          event_data.eventNumber = res.headers._headers.location[0].split("/").slice(-1)[0];
          cb(null, event_data);
        } else {
          cb(res, null);
        }
	    }).catch(function(err) {
        cb(err, null);
      });
  },
  get: function(_event, cb) {
    const url = this.load.env.es_gateway+'/streams/'+_event.streamId+'/'+_event.eventNumber;
    const method = 'GET';
    const headers = { 'Accept': 'application/json' };
    this.load.fetch(url, {method, headers})
      .then(res=>res.json())
      .then(function(res) {
        cb(null, res);
	    }).catch(function(err) {
        cb(err, null);
      });
  },
};

module.exports = evt;
