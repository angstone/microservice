'use strict'

describe('AUTH', function() {

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
    micro.close(done);
  })

  it('Should be able to be tested', function(done) {
    done();
  })

  it('Should be able to be created', function(done) {
    micro.addProcedure({
      load: ['auth'],
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.procedures.should.contain.a.thing.with.property('load');
      expect( micro.procedures.filter(procedure=>!!procedure.load.auth).length ).to.be.at.least(1);
      done()
    });
  })

  it('Should be able to Respond a ping', function(done) {
    micro.addProcedure({
      load: ['auth'],
    }).start(()=>{
        expect(micro).to.be.exists();
        micro.act('get auth ping', (err, ans)=>{
          expect(err).not.to.be.exists()
          expect(ans).to.be.equals('pong')
          done()
        });
      }
    );
  })

  /*it('Should be able to signup an User', function(done) {
    const user_signup_data = {
      name: 'Fulanildo Martinez',
      email: 'tomatecru@sefeder.com',
      password: 'magicword123'
      password_confirmation: 'magicword123'
    }
    micro.addProcedure({
      load: ['auth'],
    }).start(()=>{
        expect(micro).to.be.exists();
        micro.act('auth signup', user_signup_data, (err, ans)=>{
          expect(err).not.to.be.exists()
          expect(ans.token).to.be.exists()
          console.log('GOT TOKEN: ', ans.token)
          done()
        });
      }
    );
  })*/

})
