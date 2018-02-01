const procedures = [
  {
    name: 'ping',
    rules: null,
    procedure: require('./ping-procedure.js'),
    auto_add: false,
  },
  {
    name: 'pingautoprocedured',
    rules: null,
    procedure: require('./ping-procedure.js'),
  }
];

module.exports = procedures;
