const bunyan = require('bunyan');
const ringbuffer = new bunyan.RingBuffer({ limit: 100 });
const spawn = require('child_process').spawn;
//const CircularJSON = require('circular-json');

function LoggerModule() {
  this.load = ['env']

  this.generateLogger = function() {
    let env = this.load.env;

    let streams = [{
      level: 'trace',
      type: 'raw',    // use 'raw' to get raw log record objects
      stream: ringbuffer
    }];

    if(env.log_info_in_file) {
      streams.push({
        level: 'info',
        type: 'rotating-file',
        path: env.log_file_path+'/info.log',
        period: '1d',   // daily rotation
        count: env.log_info_file_life        // keep 3 back copies
      });
    }

    if(env.log_error_in_file) {
      streams.push({
        level: 'error',
        type: 'rotating-file',
        path: env.log_file_path+'/error.log',
        period: '1d',   // daily rotation
        count: env.log_error_file_life        // keep 3 back copies
      });
    }

    //if(env.debug) {
    //  streams.push({
    //    level: 'trace',
    //    stream: process.stdout
    //  });
    //}

    //global.JSON = CircularJSON;
    this._logger = bunyan.createLogger({ name: 'logger', streams });
  };

  this.info = function(msg) {
    this._logger.info(msg);
  };

  this.error = function(msg) {
    this._logger.error(msg);
  };

  this.start = function() {
    let env = this.load.env;

    if(env.log_info_in_file) {
      spawn('mkdir', ['-p', env.log_file_path])
      spawn('touch', [env.log_file_path+'/info.log'])
    }

    if(env.log_error_in_file) {
      spawn('mkdir', ['-p', env.log_file_path])
      spawn('touch', [env.log_file_path+'/error.log'])
    }

    this.generateLogger();
  };
}

module.exports = function() {
  return new LoggerModule();
}
