'use strict'

describe('RULER', function() {

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
      load: ['ruler'],
    }).start();
    expect(micro).to.be.exists();
    micro.procedures.should.contain.a.thing.with.property('load');
    expect( micro.procedures.filter(procedure=>!!procedure.load.ruler).length ).to.be.at.least(1);
    done()
  })

  it('Should be able to be created', function(done) {
    micro.addProcedure({
      load: ['ruler'],
    }).start();
    expect(micro).to.be.exists();
    micro.procedures.should.contain.a.thing.with.property('load');
    expect( micro.procedures.filter(procedure=>!!procedure.load.ruler).length ).to.be.at.least(1);
    done()
  })

  it('Should be able to provide a rule object', function(done) {
    micro.addProcedure({
      load: ['ruler'],
      start: async function() {
        expect(this.load.ruler).to.be.exists()
        await this.load.ruler.loadRule(require('../lib/rules/auth_signup_rule'));
        expect(this.load.ruler).to.be.exists()
        expect(this.load.ruler.pre_validation).to.be.exists()
        expect(this.load.ruler.models.user).to.be.exists()
        expect(this.load.ruler.models.user.SYSTEM_AGENT).to.be.equals(require('../lib/models/user_model').SYSTEM_AGENT)
        done()
      }
    }).start();
  })

})
