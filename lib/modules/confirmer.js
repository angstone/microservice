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
      const op_confirmed = this.getOpConfirmed(streamEvent);
      if(op_confirmed) {
        op_confirmed.cb(null, streamEvent.data);
        this.removeOp(op_confirmed);
      } else {
        const op_failed = this.getOpFailed(streamEvent);
        if(op_failed) {
          op_failed.cb(this.load.error('EVENT REJECTED'));
          this.removeOp(op_failed);
        }
      }
    }
  },
  streamError: function(err) {
    console.log('Stream Error:', err);
  },
  getOpConfirmed: function(streamEvent) {
    const confirmeds = this.ops.filter(op => op.op.stream == streamEvent.streamId )
      .filter(op => {
        const tags = this.load.tagger.getTags(op.op.type);
        const eventTags = this.load.tagger.getTags(streamEvent.eventType);

        const hasAllTags = this.load.tagger.hasAllTags(eventTags, tags);
        const hasConfirmation = this.load.tagger.hasTag(eventTags, 'c');

        return hasAllTags && hasConfirmation;
      })
      .filter(op => op.op.evt.eventId == streamEvent.data.originalEventId);
    if(confirmeds.length > 0)
      return confirmeds[0];
    return null;
  },
  removeOp: function(op) {
    this.ops = this.ops.filter(op_test => op_test.op.evt.eventId != op.op.evt.eventId );
  },
  getOpFailed: function(streamEvent) {
    const faileds = this.ops.filter(op => op.op.stream == streamEvent.streamId )
      .filter(op => {
        const tags = this.load.tagger.getTags(op.op.type);
        const eventTags = this.load.tagger.getTags(streamEvent.eventType);

        const hasAllTags = this.load.tagger.hasAllTags(eventTags, tags);
        const hasFailure = this.load.tagger.hasTag(eventTags, 'f');

        return hasAllTags && hasFailure;
      })
      .filter(op => op.op.evt.eventId == streamEvent.data.originalEventId);
    if(faileds.length > 0)
      return faileds[0];
    return null;
  },
};

module.exports = confirmer;
