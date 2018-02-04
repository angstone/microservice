module.exports = {
  // externals
  uid: () => require('uuid/v1'),
  fetch: () => require('node-fetch'),
  eventStore: () => require('event-store-client'),
  // internals
  toucher: () => require('./toucher.js'),
  evt: () => require('./evt.js'),
  tagger: () => require('./tagger.js'),
  streamListener: () => require('./streamListener.js'),
  dispatcher: () => require('./dispatcher.js'),
  confirmer: () => require('./confirmer.js'),
};
