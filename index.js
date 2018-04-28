const Hemera = require("nats-hemera");
const micro = {};

micro.procedures = {};
micro.hemera_add_array = [];
micro.env = require('./lib/env.js');
micro.modules = require('./lib/modules');

micro.add = (resource, action, func=null) => {
  if(func==null) { func = action; action = resource; resource = 'system'; }
  micro.hemera_add_array.push({resource, action, func});
  return micro;
};

micro.mock = (req, cb, procedure_name, mocked_data) => {
  if(micro.env.mock)
    cb(null, mocked_data);
  else
    micro.procedures[procedure_name].run(req, cb);
};

micro.autoAdd = (procedure) => {
  if(procedure.auto_add) {
    micro.add(procedure.resource, procedure.action, (req, cb) => {
      return micro.mock(req, cb, procedure.name, procedure.mocked);
    });
  }
};

// autocomplete config with defaults
micro.completeConfigForProcedure = (procedure) => {
  procedure.rules = procedure.rules || null;
  procedure.load = procedure.load || [];
  procedure.auto_add = procedure.auto_add == undefined ? true : procedure.auto_add;
  procedure.resource = procedure.resource || 'system';
  procedure.mocked = procedure.mocked || {};
  return procedure;
}

micro.loadModules = (procedure) => {
  if( procedure.load != undefined && procedure.load instanceof Array ) {
    const modules = {};
    procedure.load.forEach( module_name => {
      const module = micro.modules[module_name]();
      modules[module_name] = micro.loadModules(module);
    });
    procedure.load = modules;
  }
  if(procedure.start) procedure.start();
  return procedure;
};

micro.addProcedure = (procedure) => {
  procedure = micro.completeConfigForProcedure(procedure);
  procedure = micro.loadModules(procedure);
  micro.procedures[procedure.name] = procedure;
  micro.autoAdd(procedure);
  return micro;
};

micro.addProcedures = (procedures) => {
  procedures.forEach( procedure => micro.addProcedure(procedure) );
  return micro;
};

micro.addOperator = (operator) => {
  return micro.addProcedure({
  	resource: operator.resource || 'system',
  	action: operator.action,
  	load: ['operator', 'error', 'insurer'],
    rules: operator.rules || micro.lookForRules(operator.resource || 'system', operator.action),
  	run: function(req, cb) {
  		const op = {
  			resource: this.resource,
  			action: this.action,
  			data: req.data
  		};
      // apply business rules
      if(this.rules)
        this.preValidate(op, cb);
      else
        this.ensure(op, cb);
  	},
    preValidate: function(op, cb) {
      if(this.rules.pre_validation) {
        this.rules.pre_validation(op, (err, validation)=>{
          if(err) cb(this.load.error(err));
          else if(validation) cb(this.load.error(validation));
          else this.ensure(op, cb);
        });
      } else {
        this.ensure(op, cb);
      }
    },
    ensure: function(op, cb) {
      this.load.insurer.ensure(op, this.rules.models, (err, assured)=>{
        if(err) cb(this.load.error(err));
        else if(assured) this.authorize(op, cb);
        else cb(this.load.error('SERVER IS BUSY IN RENDER'));
      })
    },
    authorize: function(op, cb) {
      this.validate(op, cb);
    },
    validate: function(op, cb) {
      if(this.rules.validation) {
        this.rules.validation(op, (err, validation)=>{
          if(err) cb(this.load.error(err));
          else if(validation) cb(this.load.error(validation));
          else this.includeInOp(op, cb);
          //else this.load.operator.operate(op, cb);
        });
      } else {
        this.includeInOp(op, cb);
        //this.load.operator.operate(op, cb);
      }
    },
    includeInOp: function(op, cb) {
      if(this.rules.includeInOp) {
        this.rules.includeInOp(op, (err, include)=>{
          if(err) cb(err);
          else {
            op.data.include = include;
            this.load.operator.operate(op, (_err, _res)=>{
              if(_err) cb(_err);
              else this.respond(op, _res, cb);
            });
          }
        });
      } else {
        this.load.operator.operate(op, (_err, _res)=>{
          if(_err) cb(_err);
          else this.respond(op, _res, cb);
        });
      }
    },
    respond: function(op, res, cb) {
      if(this.rules.respondWith) this.rules.respondWith(op, cb);
      else cb(null, res);
    },
  });
};

micro.lookForRules = (res, act) => {
  const all_rules = require(micro.env.rules);
  if(!all_rules) return null;

  let res_rules = all_rules[res];
  if(!res_rules) return null;
  res_rules = res_rules();

  let act_rules = res_rules[act];
  if(!act_rules) return null;
  act_rules = act_rules();

  if(act_rules.models)
    act_rules.models = micro.lookForModels(act_rules.models);

  return act_rules;
};

micro.lookForModels = (models) => {
  const all_models = require(micro.env.models);
  if(!all_models) return null;

  const models_obj = {};
  models.forEach(model_str => {
    let model_got = all_models[model_str];
    if(!model_got) return null;

    models_obj[model_str] = model_got();

    if(!models_obj[model_str].name) models_obj[model_str].name = model_str;

    models_obj[model_str].db = micro.loadModules(micro.modules.db());
    models_obj[model_str].create = function(data) {

      if(!this.Model) {
        models_obj[model_str].schema._id = Number;
        const schema = this.db.schema(models_obj[model_str].schema, { collection:models_obj[model_str].name });

        if(models_obj[model_str].methods) {
          for(let method in models_obj[model_str].methods) {
            if(models_obj[model_str].methods.hasOwnProperty(method)) {
              schema.methods[method] = models_obj[model_str].methods[method];
            }
          }
        }
        this.Model = this.db.model(models_obj[model_str].name, schema);
      }
      if(data) {
        data._id = data.id;
        delete data.id;
        const model = this.Model(data);
        model.Model = this.Model;
        return model;
      } else return this.Model;
    };
  });
  return models_obj;
};

micro.addReducers = (reducers) => {
  reducers.map(reducer => micro.loadModules(reducer));
  micro.addProcedure({
    name: 'reducer',
    auto_add: false,
    load: ['reducer'],
    start: function() {
      this.load.reducer.redux(reducers);
    },
  });
  return micro;
}

micro.addRenders = (renders) => {
  const renders_mod = renders.map( render => {
    render.resource = render.resource || 'system';
    if(render.models) render.models = micro.lookForModels(render.models);
    return render;
  });

  micro.addProcedure({
    name: 'render',
    auto_add: false,
    load: ['render'],
    start: function() {
      this.load.render.renderize(renders_mod);
    },
  });
  return micro;
}

// function of what and callback
micro.addView = (vent, func) => {
  micro.add('view_'+vent,'take',(req, cb)=>{
    const what = req.data;
    if(!what.by)
      what.by = 'id';
    return func(what, cb);
  });
  return micro;
};

micro.addViews = (views) => {
  views.forEach(view => {
    const models = view.models ? micro.lookForModels(view.models) : null;
    micro.addView(view.vent, function(pars, cb) {
      const sight = view.sights[pars.by];
      if(!sight) cb('INTERNAL ERROR: UNKNOWN WAY OF VIEW', null);
      else sight(pars, models, cb);
    });
  });
  return micro;
};

micro.act = (task, cb) => {
  task.topic = task.resource || 'system';
  task.cmd = task.action || 'ping';
  delete task.resource;
  delete task.action;
  micro.hemera.act(task, cb);
  return micro;
};

micro.view = (what, cb) => {
  if(!what.by)
    what.by = 'id';
  micro.act({resource: 'view_'+what.vent, action: 'take', data: what}, cb);
  return micro;
};

micro.create = (env=null) => {
  // apply env merge
  if(env!=null)
    micro.env = Object.assign({}, micro.env, env);
  // create add injector
  micro.modules.add = () => micro.add;
  // create env module injector
  micro.modules.env = () => micro.env;
  // create hemera instance
  micro.hemera = new Hemera(
    require("nats").connect({
      'url': micro.env.nats_url,
      'user': micro.env.nats_user,
      'pass': process.env.nats_pw
    }),
    {
      logLevel: micro.env.hemera_logLevel,
      timeout: micro.env.hemera_timeout,
    }
  );
  return micro;
};

micro.start = (main=null) => {
  micro.hemera.ready(async () => {
    for(add_line of micro.hemera_add_array)
      micro.hemera.add({topic: add_line.resource, cmd: add_line.action}, add_line.func);
    if(main)
      main();
  });
  return micro;
};

module.exports = micro;
