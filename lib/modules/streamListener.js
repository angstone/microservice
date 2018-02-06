const streamListener = {
  load: ['env', 'eventStore'],
  listeners: [],
  start: function() {
    this.options = {
      host: this.load.env.es_host,
	    port: this.load.env.es_port,
      debug: this.load.env.es_debug,
    };
    this.credentials = {
      username: this.load.env.es_username,
      password: this.load.env.es_password,
    }
    this.connection = new this.load.eventStore.Connection(this.options);
    return this;
  },
  listenTo: function(stream_name, onEvent, err) {
    return this.connection.subscribeToStream(stream_name, true,
      (streamEvent) => {
        if(streamEvent.streamId == stream_name)
          onEvent(streamEvent);
      },
      () => {},
      () => { err('subscription dropped') },
      this.credentials,
      () => { err('subscription not handled') }
    );
  },
  drop: function(id) {
    this.connection.unsubscribeFromStream(id, this.credentials, function() { });
  },
};

module.exports = streamListener;
