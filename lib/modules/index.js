module.exports = {
  // externals
  uid: () => require('uuid/v1'),
  fetch: () => require('node-fetch'),
  eventStore: () => require('event-store-client'),
  // internals
  error: () => require('./error.js'),
  evt: () => require('./evt.js'),
  tagger: () => require('./tagger.js'),
  streamListener: () => require('./streamListener.js'),
  dispatcher: () => require('./dispatcher.js'),
  confirmer: () => require('./confirmer.js'),
  operator: () => require('./operator.js'),
  reducer: () => require('./reducer.js'),
  render: () => require('./render.js'),
  db: () => require('./db.js'),
  insurer: () => require('./insurer.js'),
};
