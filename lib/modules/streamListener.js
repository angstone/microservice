const streamListener = {
  load: ['env', 'eventStore'],
  listeners: [],
  start: function() {
    this.options = {
      host: this.load.env.es_host,
	    port: this.load.env.es_port,
      debug: this.load.env.es_debug
    };
    this.credentials = {
      username: this.load.env.es_username,
      password: this.load.env.es_password
    }
    this.connection = new this.load.eventStore.Connection(this.options);
    return this;
  },
  listenTo: function(stream_name, onEvent, err, onReach=null) {
    if(!onReach) {
      return this.connection.subscribeToStream(stream_name, true,
        (streamEvent) => { onEvent(streamEvent) },
        () => {},
        () => { err('subscription dropped') },
        this.credentials,
        () => { err('subscription not handled') }
      );
    } else {
      return this.connection.subscribeToStreamFrom(stream_name, 0,
        this.credentials,
        (streamEvent) => { onEvent(streamEvent) },
        ()=>{ onReach() },
        ()=>{});
    }
  },
  backFrom: function(stream_name, eventNumber, howMany, cb=null) {
    if(cb==null) { cb = howMany; howMany = eventNumber; stream_name = 'system'; }
    return this.connection.readStreamEventsBackward(stream_name, eventNumber, howMany, true, true, null, this.credentials, cb);
  },
  drop: function(id) {
    this.connection.unsubscribeFromStream(id, this.credentials, function(){});
  }
};

module.exports = streamListener;
