// insurances is a table that must contains:
// model: user,
// resource: users,
// action: create,
// ready: false/true,
module.exports = {
  load: ['db','error','evt'],
  start: function() {
    const schema = this.load.db.schema({
      model: String,
      resource: String,
      action: String,
      ready: Boolean
    });
    this.Model = this.load.db.model('insurances', schema);
  },
  block: function(blocks, cb) {
    this.blocks_status = {};
    blocks.forEach(block=>{

      this.load.evt.send('render|started').with({ date: Date.now() }).to(block.resource).then((err)=>{
        if(err) console.error(this.load.error('FAILURE IN REPORTING RENDER START EVENT: '), err);
      });

      if(!this.blocks_status[block.model]) this.blocks_status[block.model] = {};
      if(!this.blocks_status[block.model][block.resource]) this.blocks_status[block.model][block.resource] = {};
      if(!this.blocks_status[block.model][block.resource][block.status]) this.blocks_status[block.model][block.resource][block.status] = {};

      this.blocks_status[block.model][block.resource][block.action] = 'waiting';

      this.Model.findOne({ model:block.model, resource:block.resource, action:block.action }, (err, block_model)=>{
        if(err) cb(err);
        else if(block_model){
          block_model.ready = false;
          block_model.save(err=>{
            if(err) cb(err);
            else this.blocks_status[block.model][block.resource][block.action] = 'blocked';
          });
        } else {
          this.Model({ model:block.model, resource:block.resource, action:block.action, ready:false }).save(err=>{
            if(err) cb(err);
            else this.blocks_status[block.model][block.resource][block.action] = 'blocked';
          });
        }
      });
    });

    this.waitForBlocks(cb);
  },
  allow: function(allows, cb) {
    this.allows_status = {};
    allows.forEach(allow=>{

      this.load.evt.send('render|ended').with({ date: Date.now() }).to(allow.resource).then((err)=>{
        if(err) console.error(this.load.error('FAILURE IN REPORTING RENDER ENDED EVENT: '), err);
      });

      if(!this.allows_status[allow.model]) this.allows_status[allow.model] = {};
      if(!this.allows_status[allow.model][allow.resource]) this.allows_status[allow.model][allow.resource] = {};
      if(!this.allows_status[allow.model][allow.resource][allow.status]) this.allows_status[allow.model][allow.resource][allow.status] = {};

      this.allows_status[allow.model][allow.resource][allow.action] = 'waiting';

      this.Model.findOne({ model:allow.model, resource:allow.resource, action:allow.action }, (err, allow_model)=>{
        if(err) cb(err);
        else if(allow_model){
          allow_model.ready = true;
          allow_model.save(err=>{
            if(err) cb(err);
            else this.allows_status[allow.model][allow.resource][allow.action] = 'allowed';
          });
        } else { cb(this.load.error('INSURANCE DOCUMENT NOT FOUND')); }
      });
    });

    this.waitForAllows(cb);
  },
  waitForBlocks: function(cb) {
    setTimeout(()=>{
      let stillWaiting = false;

      for(let model in this.blocks_status) {
        if(this.blocks_status.hasOwnProperty(model)){
          for(let resource in this.blocks_status[model]) {
            if(this.blocks_status[model].hasOwnProperty(resource)) {
              for(let action in this.blocks_status[model][resource]) {
                if(this.blocks_status[model][resource].hasOwnProperty(action)) {
                  if(this.blocks_status[model][resource][action]=='waiting') {
                    stillWaiting = true;
                  }
                }
              }
            }
          }
        }
      }

      if(stillWaiting) this.waitForBlocks(cb);
      else cb(null);
    }, 10);
  },
  waitForAllows: function(cb) {
    setTimeout(()=>{
      let stillWaiting = false;

      for(let model in this.allows_status) {
        if(this.allows_status.hasOwnProperty(model)){
          for(let resource in this.allows_status[model]) {
            if(this.allows_status[model].hasOwnProperty(resource)) {
              for(let action in this.allows_status[model][resource]) {
                if(this.allows_status[model][resource].hasOwnProperty(action)) {
                  if(this.allows_status[model][resource][action]=='waiting') {
                    stillWaiting = true;
                  }
                }
              }
            }
          }
        }
      }

      if(stillWaiting) this.waitForAllows(cb);
      else cb(null);
    }, 10);
  },
  ensure: function(op, models_obj, cb) {
    if(!this.models_status) this.models_status = {};

    for(let model_name in models_obj) {
      if(models_obj.hasOwnProperty(model_name)) {
        this.models_status[model_name] = 'waiting';
      }
    }

    for(let model_name in this.models_status) {
      this.Model.findOne({ model:model_name, ready:false }, (err, insurance)=>{
        if(err) this.models_status[model_name] = err;
        else if(insurance) this.models_status[model_name] = false;
        else this.models_status[model_name] = true;
      });
    }

    this.waitForResults(cb);
  },
  waitForResults: function(cb) {
    setTimeout(()=>{
      let stillWaiting = false;
      let errorInAtLeastOne = null;
      let safe = true;
      for(let status_key in this.models_status) {
        if(this.models_status.hasOwnProperty(status_key)) {
          const status = this.models_status[status_key];
          if(status=='waiting') stillWaiting = true;
          else if((status != true) && (status != false)) errorInAtLeastOne = status;
          else if(!status) safe = false;
        }
      }
      if(errorInAtLeastOne) cb(errorInAtLeastOne);
      else if(!safe) cb(null, false);
      else if(stillWaiting) this.waitForResults(cb);
      else cb(null, true);
    }, 5);
  },
};
