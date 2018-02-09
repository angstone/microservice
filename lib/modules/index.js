module.exports = {
  // externals
  uid: () => require('uuid/v1'),
  fetch: () => require('node-fetch'),
  eventStore: () => require('event-store-client'),
  // internals
  error: () => require('./error.js'),
  toucher: () => require('./toucher.js'),
  deb: () => require('./deb.js'),
  evt: () => require('./evt.js'),
  tagger: () => require('./tagger.js'),
  streamListener: () => require('./streamListener.js'),
  dispatcher: () => require('./dispatcher.js'),
  confirmer: () => require('./confirmer.js'),
  operator: () => require('./operator.js'),
  reducer: () => require('./reducer.js'),
  view: () => require('./view.js'),
};
