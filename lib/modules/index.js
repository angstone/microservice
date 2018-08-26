function ModuleLoader() {
  this.instances = {};

  this.newInstance = (module_name) => { return () => {
    const module = require('./'+module_name)();
    if(!module.name) module.name = module_name;
    return module;
  }};

  this.singleton = (module_name) => {
    return () => {
      if(!this.instances[module_name]) {
        this.instances[module_name] = this.newInstance(module_name)()
      }
      return this.instances[module_name]
    }
  };

  this.modules = {
    logger: this.singleton('logger'),
    error: this.singleton('error'),
    util: this.newInstance('util'),
    configServer: this.singleton('configServer'),
    modeler: this.singleton('modeler'),
    ruler: this.newInstance('ruler'),
    commander: this.singleton('commander'),
    auth: this.singleton('auth'),
    evt: this.singleton('evt'),
    //tagger: () => require('./tagger.js'),
    //streamListener: () => require('./streamListener.js'),
    //confirmer: () => require('./confirmer.js'),
    //operator: () => require('./operator.js'),
    //reducer: () => require('./reducer.js'),
    //render: () => require('./render.js'),
    //db: () => require('./db.js'),
    //insurer: () => require('./insurer.js'),
  };

}

module.exports = function() {
  return new ModuleLoader().modules;
};
