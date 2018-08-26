const Hemera = require('nats-hemera');
const nats = require('nats');
const CircularJSON = require('circular-json');

function Micro(_env) {
  this.env = require('./env.js')();
  if(_env) this.env = Object.assign({}, this.env, _env); // apply env merge

  this.modules = require('./modules')();
  this.procedures = [];
  this.hemera_add_array = [];

  // Setup Hemera
  this.nats_con = nats.connect({ url: this.env.nats_url, user: this.env.nats_user, pass: this.env.nats_pass }); // create nats connection
  this.hemera_conf = { logLevel: this.env.hemera_logLevel, timeout: this.env.hemera_timeout }; // config hemera
  this.hemera = new Hemera( this.nats_con, this.hemera_conf); // create hemera instance

  this.add = (action, _func=null) => {
    const func = _func == null ? null : (req, cb) => _func(req.payload, cb);
    this.hemera_add_array.push({action, func});
    return this;
  };

  this.act = (action, payload, cb=null) => {
    if(cb==null) { cb = payload; payload = null; }
    this.hemera.act({topic: this.env.app_topic, cmd: action, payload}, cb);
    return this;
  };

  // Add general singleton modules provided here
  this.modules.env = () => this.env; // create env module injector
  //this.modules.debug = () => this.debug; // create debug module
  this.modules.add = () => this.add; // create add module
  this.modules.act = () => this.act; // create act module

  this.loadModules = (procMod) => {
    const modules = {};
    if(procMod.load) {
      const loadArray = CircularJSON.parse( CircularJSON.stringify(procMod.load) );
      if( loadArray instanceof Array ) {
        loadArray.forEach( module_name => {
          const module = this.modules[module_name]();
          modules[module_name] = this.loadModules(module);
        });
        procMod.load = modules;
        if(procMod.start) procMod.start();
      }
    }
    return procMod;
  };

  this.addProcedure = (proc) => {
    proc.load = proc.load || [];
    proc = this.loadModules(proc);
    this.procedures.push(proc);
    return this;
  }

  this.start = (main=null) => {
    this.hemera.ready(async () => {
      for(let add_line of this.hemera_add_array)
      this.hemera.add({topic: this.env.app_topic, cmd: add_line.action, timeout$: this.env.hemera_timeout, expectedMessages$: 1}, add_line.func);
      if(main) main();//setTimeout(main, 10);
    });
    return this;
  };

  this.close = (fn) => {
    this.hemera.close(fn)
    return this;
  };
}

module.exports = function(env) {
  return new Micro(env);
};


/*
micro.debug = (...args) => {
  if(micro.env.debug) {
    if(args.length==0) console.log('DEBUG POINT');
    else console.log(args);
  }
};
*/



/*
micro.addProcedures = (procedures) => {
  procedures.forEach( procedure => micro.addProcedure(procedure) );
  return micro;
};
*/

//micro.addOperator = (operator) => {
//  return micro.addProcedure({
//  	resource: operator.resource || 'system',
//  	action: operator.action,
//  	load: ['operator', 'error', 'insurer'],
//    rules: operator.rules || micro.lookForRules(operator.resource || 'system', operator.action),
//  	run: function(req, cb) {
//  		const op = {
//  			resource: this.resource,
//  			action: this.action,
//  			data: req.data
//  		};
//      // apply business rules
//      if(this.rules)
//        this.preValidate(op, cb);
//      else
//        this.ensure(op, cb);
//  	},
//    preValidate: function(op, cb) {
//      if(this.rules.pre_validation) {
//        this.rules.pre_validation(op, (err, validation)=>{
//          if(err) cb(this.load.error(err));
//          else if(validation) cb(this.load.error(validation));
//          else this.ensure(op, cb);
//        });
//      } else {
//        this.ensure(op, cb);
//      }
//    },
//    ensure: function(op, cb) {
//      this.load.insurer.ensure(op, this.rules.models, (err, assured)=>{
//        if(err) cb(this.load.error(err));
//        else if(assured) this.authorize(op, cb);
//        else cb(this.load.error('SERVER IS BUSY IN RENDER'));
//      })
//    },
//    authorize: function(op, cb) {
//      this.validate(op, cb);
//    },
//    validate: function(op, cb) {
//      if(this.rules.validation) {
//        this.rules.validation(op, (err, validation)=>{
//          if(err) cb(this.load.error(err));
//          else if(validation) cb(this.load.error(validation));
//          else this.includeInOp(op, cb);
//          //else this.load.operator.operate(op, cb);
//        });
//      } else {
//        this.includeInOp(op, cb);
//        //this.load.operator.operate(op, cb);
//      }
//    },
//    includeInOp: function(op, cb) {
//      if(this.rules.includeInOp) {
//        this.rules.includeInOp(op, (err, include)=>{
//          if(err) cb(this.load.error(err));
//          else {
//            op.data.include = include;
//            this.load.operator.operate(op, (_err, _res)=>{
//              if(_err) cb(this.load.error(_err));
//              else this.respond(op, _res, cb);
//            });
//          }
//        });
//      } else {
//        this.load.operator.operate(op, (_err, _res)=>{
//          if(_err) cb(this.load.error(_err));
//          else this.respond(op, _res, cb);
//        });
//      }
//    },
//    respond: function(op, res, cb) {
//      if(this.rules.respondWith) this.rules.respondWith(op, cb);
//      else cb(null, res);
//    },
//  });
//};

//micro.lookForRules = (res, act) => {
//  const all_rules = require(micro.env.rules);
//  if(!all_rules) return null;
//
//  let res_rules = all_rules[res];
//  if(!res_rules) return null;
//  res_rules = res_rules();
//
//  let act_rules = res_rules[act];
//  if(!act_rules) return null;
//  act_rules = act_rules();
//
//  if(act_rules.models)
//    act_rules.models = micro.lookForModels(act_rules.models);
//
//  return act_rules;
//};

//micro.lookForModels = (models) => {
//  const all_models = require(micro.env.models);
//  if(!all_models) return null;
//
//  const models_obj = {};
//  models.forEach(model_str => {
//    let model_got = all_models[model_str];
//    if(!model_got) return null;
//
//    models_obj[model_str] = model_got();
//
//    if(!models_obj[model_str].name) models_obj[model_str].name = model_str;
//
//    models_obj[model_str].db = micro.loadModules(micro.modules.db());
//    models_obj[model_str].create = function(data) {
//
//      if(!this.Model) {
//        models_obj[model_str].schema._id = Number;
//        const schema = this.db.schema(models_obj[model_str].schema, { collection:models_obj[model_str].name });
//
//        if(models_obj[model_str].methods) {
//          for(let method in models_obj[model_str].methods) {
//            if(models_obj[model_str].methods.hasOwnProperty(method)) {
//              schema.methods[method] = models_obj[model_str].methods[method];
//            }
//          }
//        }
//        this.Model = this.db.model(models_obj[model_str].name, schema);
//      }
//      if(data) {
//        data._id = data.id;
//        delete data.id;
//        const model = this.Model(data);
//        model.Model = this.Model;
//        return model;
//      } else return this.Model;
//    };
//  });
//  return models_obj;
//};
//
//micro.addReducers = (reducers) => {
//  reducers.map(reducer => micro.loadModules(reducer));
//  micro.addProcedure({
//    name: 'reducer',
//    auto_add: false,
//    load: ['reducer'],
//    start: function() {
//      this.load.reducer.redux(reducers);
//    },
//  });
//  return micro;
//}
//
//micro.addRenders = (renders) => {
//  const renders_mod = renders.map( render => {
//    render.resource = render.resource || 'system';
//    if(render.models) render.models = micro.lookForModels(render.models);
//    return render;
//  });
//
//  micro.addProcedure({
//    name: 'render',
//    auto_add: false,
//    load: ['render'],
//    start: function() {
//      this.load.render.renderize(renders_mod);
//    },
//  });
//  return micro;
//}
//
//// function of what and callback
//micro.addView = (vent, func) => {
//  micro.add('view_'+vent,'take',(req, cb)=>{
//    const what = req.data;
//    if(!what.by)
//      what.by = 'all';
//    return func(what, cb);
//  });
//  return micro;
//};
//
//micro.addViews = (views) => {
//  views.forEach(view => {
//    const models = view.models ? micro.lookForModels(view.models) : null;
//    micro.addView(view.vent, function(pars, cb) {
//      const sight = view.sights[pars.by];
//      if(!sight) cb(new MicroError('INTERNAL ERROR: UNKNOWN WAY OF VIEW'), null);
//      else sight(pars, models, cb);
//    });
//  });
//  return micro;
//};
//

//
//micro.view = (what, cb) => {
//  if(!what.by) {
//    if(what.id) what.by = 'id';
//    else what.by = 'all';
//  }
//  micro.act({resource: 'view_'+what.vent, action: 'take', data: what}, cb);
//  return micro;
//};
