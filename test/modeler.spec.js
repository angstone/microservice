'use strict'

describe('MODELER', function() {

  let server
  let micro

  before(function(done) {
    server = MicroserviceTestServer(done);
  })

  after(function(done) {
    server.kill()
    done()
  })

  beforeEach(function(done) {
    micro = Micro({ nats_url });
    done()
  })

  afterEach(function(done) {
    micro.close(done)
  })

  it('Should be able to be tested', function(done) {
    done();
  })

  it('Should be able to be created', function(done) {
    micro.addProcedure({
      load: ['modeler'],
    }).start();
    expect(micro).to.be.exists();
    micro.procedures.should.contain.a.thing.with.property('load');
    expect( micro.procedures.filter(procedure=>!!procedure.load.modeler).length ).to.be.at.least(1);
    done()
  })

  it('Should load an instance of an orm model object', function(done) {
    micro.addProcedure({
      load: ['modeler'],
      start: async function() {
        const model_loaded = await this.load.modeler.getModel('user', require('../lib/models/user_model'))
        const model = require('../lib/models/user_model')
        expect(model.SYSTEM_AGENT).to.be.equals(model_loaded.SYSTEM_AGENT)
        done()
      }
    }).start();
  })

})
