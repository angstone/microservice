// Use 'f' tag to failed event and 'c' tag to confirmed
const reducer = {
  load: ['env','streamListener','dispatcher','tagger'],
  reducers: [],
  streams: [],
  redux: function(reducers) {
    this.reducers = reducers.map(reducer=>{
      reducer.resource = reducer.resource || 'system';
      return reducer;
    });
    this.reducers.forEach(red => this.listenToStream(red.resource));
  },
  listenToStream: function(stream_name) {
    const already_in = this.getStream(stream_name);
    if(already_in)
      return already_in;
    const stream = {
      name: stream_name,
      listener: this.load.streamListener.listenTo(
        stream_name,
        this.checkEvent.bind(this),
        this.streamError.bind(this)
      ),
    };
    this.streams.push(stream);
    return this.getStream(stream_name);
  },
  getStream: function(stream_name) {
    const streams = this.streams.filter( st => st.name == stream_name );
    if(streams.length>0)
      return streams[0];
    return null;
  },
  checkEvent: function(streamEvent) {
    let stream = this.getStream(streamEvent.streamId);
    if(stream) {
      const red_expected = this.getRedExpected(streamEvent);
      if(red_expected) {
        red_expected.run(streamEvent, (err, payload)=>{
          if(err == null) {
            this.load.dispatcher.dispatch({
              action: this.load.tagger.addTag(red_expected.action, 'c'),
              resource: red_expected.resource,
              data: { originalEventId: streamEvent.eventId, originalEventNumber: streamEvent.eventNumber }
            }, (err, evt) => {
              if(this.load.env.debug) {
                if(err) {
                  console.log('ERROR IN DISPATCH CONFIRMATION:');
                  console.log(err);
                } else {
                  console.log('REDUCED CONFIRMATION:');
                  console.log(evt);
                }
              }
            });
          } else {
            this.load.dispatcher.dispatch({
              action: this.load.tagger.addTag(red_expected.action, 'f'),
              resource: red_expected.resource,
              data: { originalEventId: streamEvent.eventId, error: err }
            }, (err, evt) => {
              if(this.load.env.debug) {
                if(err) {
                  console.log('ERROR IN DISPATCH FAILURE:');
                  console.log(err);
                } else {
                  console.log('REDUCED FAILURE:');
                  console.log(evt);
                }
              }
            });
          }
        });
      }
    }
  },
  streamError: function(err) {
    console.log('Stream Error:', err);
  },
  getRedExpected: function(streamEvent) {
    const expecteds = this.reducers.filter(red => red.resource == streamEvent.streamId )
      .filter(red => red.action == streamEvent.eventType);
    if(expecteds.length > 0)
      return expecteds[0];
    return null;
  },
};

module.exports = reducer;
