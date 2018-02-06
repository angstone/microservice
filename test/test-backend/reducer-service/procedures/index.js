// Use 'f' tag to failed event and 'c' tag to confirmed
const procedures = [
  {
    name: 'reducer',
    auto_add: false,
    load: ['reducer'],
    start: function() {
      this.load.reducer.redux(require('./reducers'));
    },
  },
];

module.exports = procedures;
