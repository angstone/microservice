function Util() {
  //load: ["env"],
  /*start: function() {
    this.includePing();
  },*/
  this.mergeDeep = function(target, source) {
    if(this.isObject(target) && this.isObject(source)) {
      for(const key in source) {
        if(this.isObject(source[key])) {
          if(!target[key]) Object.assign(target, { [key]: {} });
          else if(!this.isObject(target[key])) target[key] = {};
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    return target;
  }

  this.isObject = function(item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
  }

}

module.exports = function() { return new Util() };
