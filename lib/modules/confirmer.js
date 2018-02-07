// Use 'f' tag to failed event and 'c' tag to confirmed
const confirmer = {
  load: ['tagger','streamListener','error'],
  ops: [],
  streams: [],
  confirm: function(op, cb) {
    this.ops.push({op, cb});
    this.listenToStream(op.stream);
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
      const op_confirmed_or_failed = this.getOpConfirmedOrFailed(streamEvent);
      if(op_confirmed_or_failed) {
        if(op_confirmed_or_failed.confirmed)
          op_confirmed_or_failed.cb(null, streamEvent.data);
        else
          op_confirmed_or_failed.cb(this.load.error('EVENT REJECTED'));
        this.removeOp(op_confirmed_or_failed);
      }
    }
  },
  streamError: function(err) {
    console.log('Stream Error:', err);
  },
  getOpConfirmedOrFailed: function(streamEvent) {
    if(streamEvent.data) {
      if(streamEvent.data.originalEventId) {
        const op_confirmeds_or_faileds = this.ops
          .filter(op => op.op.stream == streamEvent.streamId )
          .filter(op => op.op.evt.eventId == streamEvent.data.originalEventId)
          .reduce((ops, op) => {
            const tags = this.load.tagger.getTags(op.op.type);
            const eventTags = this.load.tagger.getTags(streamEvent.eventType);
            const hasAllTags = this.load.tagger.hasAllTags(eventTags, tags);
            const hasConfirmation = this.load.tagger.hasTag(eventTags, 'c');
            const hasFailure = this.load.tagger.hasTag(eventTags, 'f');
            if( hasAllTags ) {
              if(hasConfirmation) {
                op.confirmed = true;
                ops.push(op);
              } else if(hasFailure) {
                op.confirmed = false;
                ops.push(op);
              }
            }
            return ops;
          },[]);
        if(op_confirmeds_or_faileds.length > 0)
          return op_confirmeds_or_faileds[0];
      }
    }
    return null;
  },
  removeOp: function(op) {
    this.ops = this.ops.filter(op_test => op_test.op.evt.eventId != op.op.evt.eventId );
  }
};

module.exports = confirmer;
