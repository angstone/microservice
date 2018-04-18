const render = {
  load: ['env','streamListener','dispatcher','tagger', 'db', 'evt', 'deb', 'error'],
  renders: [],
  streams: [],
  renderize: function(renders) {
    const internalLoad = {};
    internalLoad.db = this.load.db;
    this.renders = renders.map(ren => {
      ren.load = internalLoad;
      ren.type = this.load.tagger.addTag(ren.type, 'c');
      return ren;
    });
    this.renders.forEach(ren => this.listenToStream(ren.stream));
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
      const ren_expected = this.getRenExpected(streamEvent);
      if(ren_expected) {
        this.loadOriginalEvent(streamEvent, (err_0, originalEvent) => {
          if(err_0) {
            console.log('ORIGINAL_EVENT NOT FOUND');
          } else {
            this.expectedWork(ren_expected, originalEvent);
          }
        });
      }
    }
  },
  loadOriginalEvent: function(_event, cb) {
    _event.eventNumber = _event.data.originalEventNumber;
    this.load.evt.get(_event, (err, res)=>{
      if(err) {
        cb(err, null);
      } else {
        _event.data = res;
        cb(null, _event);
      }
    });
  },
  expectedWork: function(ren_expected, originalEvent) {
    ren_expected.run(originalEvent, this.load.db, (err, payload)=>{
      if(err == null) {
        this.load.dispatcher.dispatch({
          type: this.load.tagger.addTag(ren_expected.type, 'r'), // r for renderized
          stream: ren_expected.stream,
          payload: { originalEventId: originalEvent.eventId, originalNumber: originalEvent.eventNumber }
        }, (err, evt) => {
          if(this.load.env.debug) {
            if(err)
              this.load.deb.deb('ERROR IN DISPATCH RENDER CONFIRMATION: ', err);
            else
              this.load.deb.deb('RENDER CONFIRMATION: ', evt);
          }
        });
      } else {
        this.load.dispatcher.dispatch({
          type: this.load.tagger.addTag(ren_expected.type, 'rf'), // rf for render failure
          stream: ren_expected.stream,
          payload: { originalEventId: originalEvent.eventId, error: err }
        }, (err, evt) => {
          if(this.load.env.debug) {
            if(err)
              this.load.deb.deb('ERROR IN DISPATCH RENDER FAILURE: ', err);
            else
              this.load.deb.deb('RENDERIZED FAILURE: ', evt);
          }
        });
      }
    });
  },
  streamError: function(err) {
    console.log('Stream Error:', err);
  },
  getRenExpected: function(streamEvent) {
    const expecteds = this.renders.filter(ren => ren.stream == streamEvent.streamId )
      .filter(ren => ren.type == streamEvent.eventType);
    if(expecteds.length > 0)
      return expecteds[0];
    return null;
  },
};

module.exports = render;
