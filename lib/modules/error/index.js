
function ErrorModule() {
  this.load = ['logger', 'env'];
  this.COMMON_TYPES = require('./commonTypes');
  this.NO_DESCRIPTION = 'No description was provided for this error.';

  this.is = function(commonType=this.COMMON_TYPES.GENERIC_OPERATIONAL, description=this.NO_DESCRIPTION) {
    const error = new Error(description==this.NO_DESCRIPTION ? commonType : description);
    error.commonType = commonType;
    error.description = description;
    error.isOperational = true;
    return error;
  };

  this.fatal = function(commonType=this.COMMON_TYPES.UNKNOWN, description=this.NO_DESCRIPTION) {
    const error = new Error(description==this.NO_DESCRIPTION ? commonType : description);
    error.commonType = commonType;
    error.description = description;
    error.isOperational = false;
    return error;
  };

  this.throw = function(commonType=this.COMMON_TYPES.GENERIC_OPERATIONAL, description=this.NO_DESCRIPTION) {
    throw this.is(commonType, description);
  };

  this.throwFatal = function(commonType=this.COMMON_TYPES.UNKNOWN, description=this.NO_DESCRIPTION) {
    throw this.fatal(commonType, description);
  };

  this.identifyCommonErrors = function(err) {
    if(err.message==this.COMMON_TYPES.PATTERN_NOT_FOUND) {
      err.isOperational = true;
      err.commonType = this.COMMON_TYPES.PATTERN_NOT_FOUND;
      err.description = err.message;
    }
    return err;
  }

  this.handle = function(err) {
    err = this.identifyCommonErrors(err);
    let err_text = 'Error! Type: '+(err.commonType ? err.commonType : err.name ? err.name : this.COMMON_TYPES.UNKNOWN)
      +' | Description: '+(err.description ? err.description : err.message ? err.message : this.NO_DESCRIPTION);
    if(!err.isOperational) {
      this.load.logger.error(err_text);
      if(this.load.env.debug) console.error(err);
      process.exit(1);
    } else {
      this.load.logger.info(err_text);
    }
  };

  this.start = function() {
    process.on('uncaughtException', (err)=>{ this.handle(err) });
    process.on('unhandledRejection', (err)=>{ this.handle(err) });
    process.on('error', (err)=>{ this.handle(err) });
  }

}

module.exports = function() {
  return new ErrorModule();
}
