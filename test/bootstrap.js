//'use strict'

// Fix memory leaks preventer warnings about event mas listeners limit. Please track this number!
// 12-07-2018 08:41 -> 24
// 14-07-2018 08:41 -> 28
require('events').EventEmitter.defaultMaxListeners = 200;
process.on('warning', e => console.warn(e.stack));

global.Micro = require('../')
global.Hemera = require('../node_modules/nats-hemera')
global.HemeraSymbols = require('../node_modules/nats-hemera/lib/symbols')
global.HemeraUtil = require('../node_modules/nats-hemera/lib/util')
global.Code = require('code')
global.Hp = require('../node_modules/hemera-plugin')
global.Sinon = require('sinon')
global.HemeraTestsuite = require('hemera-testsuite')
global.expect = global.Code.expect
global.UnauthorizedError = Hemera.createError('Unauthorized')
global.chai = require('chai')
global.chaiThings = require('chai-things')
global.chai.use(global.chaiThings)
global.should = global.chai.should()
global.spawn = require('child_process').spawn

global.nats_port = 4222
global.nats_url = 'nats://localhost:' + global.nats_port

global.MicroserviceTestServer = function(done) {
  global.spawn('pkill', ['gnatsd'])
  return global.HemeraTestsuite.start_server(global.nats_port, done)
}

process.setMaxListeners(0)
