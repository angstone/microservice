function ModelerModule() {
  this.load = []

  this.models_loaded = {}

  this.getModel = async function(model_name, model_sheet) {
    if(this.models_loaded[model_name]) return this.models_loaded[model_name];
    this.models_loaded[model_name] = await this.loadModel(model_name, model_sheet);
    return this.models_loaded[model_name];
  }

  this.loadModel = async function(model_name, model_sheet) {
    const model_loaded = model_sheet;
    model_loaded.name = model_name;
    return model_loaded;
  }

}

module.exports = function() {
  return new ModelerModule();
};
