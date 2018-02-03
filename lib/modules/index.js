module.exports = {
  // externals
  uid: () => require('uuid/v1'),
  fetch: () => require('node-fetch'),
  // internals
  toucher: () => require('./toucher.js'),
  //dispatcher: () => require('./dispatcher.js'),  
};
