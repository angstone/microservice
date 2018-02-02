const procedures = [
  {
    name: 'ping',
    procedure: require('./ping-procedure.js'),
    auto_add: false,
  },
  {
    name: 'pingautoprocedured',
    procedure: require('./ping-procedure.js'),
  },
  {
    topic: 'other',
    name: 'pingdispatcher',
    loads: ['dispatcher'],
    procedure: require('./ping-dispatcher-procedure.js'),
  },
];

module.exports = procedures;
