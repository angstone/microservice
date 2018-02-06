// Use 'f' tag to failed event and 'c' tag to confirmed
const reducer = {
  load: ['deb','streamListener','dispatcher','tagger'],
  reducers: [],
  streams: [],
  redux: function(reducers) {
    this.reducers = reducers;
    this.reducers.forEach(red=>{
      this.listenToStream(red.stream);
    });
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
        red_expected.run(streamEvent.data.payload, (err, payload)=>{
          if(err == null) {
            this.load.dispatcher.dispatch({
              type: this.load.tagger.addTag(red_expected.type, 'c'),
              stream: red_expected.stream,
              payload: { originalEventId: streamEvent.eventId }
            }, (err, evt) => {
              if(err) {
                this.load.deb.deb('ERROR IN DISPATCH CONFIRMATION:');
                this.load.deb.deb(err);
              } else {
                this.load.deb.deb('REDUCED CONFIRMATION:');
                this.load.deb.deb(evt);
              }
            });
          } else {
            this.load.dispatcher.dispatch({
              type: this.load.tagger.addTag(red_expected.type, 'f'),
              stream: red_expected.stream,
              payload: { originalEventId: streamEvent.eventId, error: err }
            }, (err, evt) => {
              if(err) {
                this.load.deb.deb('ERROR IN DISPATCH FAILURE:');
                this.load.deb.deb(err);
              } else {
                this.load.deb.deb('REDUCED FAILURE:');
                this.load.deb.deb(evt);
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
    const expecteds = this.reducers.filter(red => red.stream == streamEvent.streamId )
      .filter(red => red.type == streamEvent.eventType);
    if(expecteds.length > 0)
      return expecteds[0];
    return null;
  },
};

module.exports = reducer;

/*

.redux([
  {
    stream: 'tests',
    type: 'dispatch_test',
    run: function(payload, cb) {
      cb(null, payload);
    },
  },
]);

*/
