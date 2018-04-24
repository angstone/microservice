// insurances is a table that must contains:
// resource: users,
// action: create,
// model: user,
// ready: false/true,

module.exports = {
  load: ['env','streamListener','dispatcher','tagger', 'evt', 'error', 'insurer', 'db'],
  _renders: [],
  renders: [],
  streams: [],
  renderize: function(renders) {
    this._renders = [];
    renders.forEach(render=>{
      this._renders.push(Object.assign({}, render));
    });
    this.renders = renders;
    this.eraseOldDbs(renders, err=>{
      if(err) console.error(this.load.error('ERROR ERASING OLD DBS:'), err);
      else {
        this.block(this._renders, err=>{
          if(err) console.error(this.load.error('REDERIZATION ERROR IN BLOCK INSURANCES FASE:'), err);
          else this.renderizeEvents(this.renders);
        });
      }
    });
  },
  eraseOldDbs: function (renders, cb) {
    let erase_me_dbs = [];
    renders.forEach(render=>{
      for(let model_name in render.models) {
        if(render.models.hasOwnProperty(model_name))
          erase_me_dbs.push(model_name);
      }
    });
    erase_me_dbs = erase_me_dbs.filter(erase_me=>{
      return erase_me_dbs.filter( eras => eras==erase_me ).length == 1;
    });
    this.load.db.do((err, db)=>{
      if(err) cb(this.load.error('DB BUSY COM'));
      else db.dropMany(erase_me_dbs, cb);
    });
  },
  block: function(renders, cb) {
    const to_blocks = [];
    renders.forEach(render=>{
      for(let model in render.models) {
        if(render.models.hasOwnProperty(model)) {
          to_blocks.push({ model, resource: render.resource, action: render.action });
        }
      }
    });
    this.load.insurer.block(to_blocks, cb);
  },
  renderizeEvents: function(renders) {
    this.renders = renders.map(ren => {
      ren.action = this.load.tagger.addTag(ren.action, 'c');
      return ren;
    });
    this.renders.forEach(ren => this.listenToStream(ren.resource));
  },
  allow: function(renders) {
    const to_allows = [];
    renders.forEach(render=>{
      for(let model in render.models) {
        if(render.models.hasOwnProperty(model)) {
          to_allows.push({ model, resource: render.resource, action: render.action });
        }
      }
    });
    this.load.insurer.allow(to_allows, (err)=>{
      if(err) console.error('ERROR ALLOWING MODEL INSURANCE: ', err);
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
        this.streamError.bind(this),
        this.reachEnd.bind(this)
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
            console.error('ORIGINAL_EVENT NOT FOUND');
            console.error(err_0);
          } else {
            this.expectedWork(ren_expected, originalEvent);
          }
        });
      }
    }
  },
  reachEnd: function() {
    this.allow(this._renders);
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
    ren_expected.run(originalEvent, (err, payload)=>{
      if(err) {
        console.error(this.load.error('REDERIZATION ERROR IN ONE EVENT: '));
        console.error('THE EVENT:',  originalEvent);
        console.error('THE ERROR:', err);
      }
    });
  },
  streamError: function(err) {
    console.error('Stream Error:', err);
  },
  getRenExpected: function(streamEvent) {
    const expecteds = this.renders.filter(ren => ren.resource == streamEvent.streamId )
      .filter(ren => ren.action == streamEvent.eventType);
    if(expecteds.length > 0)
      return expecteds[0];
    return null;
  },
};
