const micro = require('../../')();

micro.addProcedure({
  load: ['configServer'],
  /*start: ()=>{
    this.load.configServer.setConfig();
  },*/
});

module.exports = micro;
