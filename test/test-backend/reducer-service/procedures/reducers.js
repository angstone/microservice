module.exports = [
  {
    stream: 'tests',
    type: 'dispatch_test',
    run: function(payload, cb) {
      cb(null, payload);
    },
  },
  {
    stream: 'tests',
    type: 'dispatch_test_force_fail',
    run: function(payload, cb) {
      cb('ANY BUSINESS RULE VIOLATION', null);
    },
  }
];
