const micro = require('../../../index.js').create();
micro.addProcedures(require('./procedures'));
micro.start();
