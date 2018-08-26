'use strict'

describe('ERROR MODULE', function() {

  let server
  let micro
  let COMMON_TYPES
  let NO_DESCRIPTION

  before(function(done) {
    COMMON_TYPES = require('../lib/modules/error/commonTypes')
    NO_DESCRIPTION = 'No description was provided for this error.'
    server = MicroserviceTestServer(done)
  })

  after(function(done) {
    server.kill()
    done()
  })

  beforeEach(function(done) {
    micro = Micro({ nats_url, debug: false })
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
      load: ['error'],
    }).start(()=>{
      expect(micro).to.be.exists()
      micro.procedures.should.contain.a.thing.with.property('load')
      expect( micro.procedures.filter(procedure=>!!procedure.load.error).length ).to.be.at.least(1)
      expect( micro.procedures[0].load.error.load.logger ).to.be.exists()
      done()
    });
  })

  it('Should be able to generate errors', function(done) {
    micro.addProcedure({
      load: ['error'],
      start: function() {
        const error_generated = this.load.error.is();
        expect(this.load.error).to.be.exists()
        expect(this.load.error.is).to.be.exists()
        expect(error_generated).to.be.exists()
        expect(error_generated instanceof Error).to.be.equals(true)
        expect(error_generated.isOperational).to.be.equals(true)
        expect(error_generated.commonType).to.be.equals(COMMON_TYPES.GENERIC_OPERATIONAL);
        expect(error_generated.description).to.be.equals(NO_DESCRIPTION);
        done()
      },
    }).start();
  })

  it('Should be able to generate FATAL errors', function(done) {
    micro.addProcedure({
      load: ['error'],
      start: function() {
        const error_generated = this.load.error.fatal();
        expect(this.load.error).to.be.exists()
        expect(this.load.error.fatal).to.be.exists()
        expect(error_generated).to.be.exists()
        expect(error_generated.isOperational).to.be.equals(false)
        expect(error_generated.commonType).to.be.equals(COMMON_TYPES.UNKNOWN);
        expect(error_generated.description).to.be.equals(NO_DESCRIPTION);
        done()
      },
    }).start();
  })

  it('Should be able to throw operational errors', function(done) {
    micro.addProcedure({
      load: ['error'],
      start: function() {
        try {
          this.load.error.throw();
          console.error('There is a Error in Error Module Trown Function. Thats is very bad, dont you think?')
        } catch(e) {
          expect(e).to.be.exists();
          expect(e instanceof Error).to.be.equals(true)
          expect(e.commonType).to.be.equals(COMMON_TYPES.GENERIC_OPERATIONAL);
          expect(e.description).to.be.equals(NO_DESCRIPTION);
          done()
        }
      },
    }).start();
  })

  it('Should be able to throw fatal custom error', function(done) {
    micro.addProcedure({
      load: ['error'],
      start: function() {
        const custom_error = 'Blah and Bleh Error Type';
        const custom_description = 'Blah and Bleh Error Description Blah blahs';
        try {
          this.load.error.throwFatal(custom_error, custom_description);
          console.error('There is a Error in Error Module Fatal Function. Thats is very bad, dont you think?')
        } catch(e) {
          expect(e).to.be.exists();
          expect(e.commonType).to.be.equals(custom_error);
          expect(e.description).to.be.equals(custom_description);
          done()
        }
      },
    }).start();
  })

  it('Should handle operational errors gracefuly', function(done) {
    spawn('rm', ['-r', 'log']).on('close', (code)=>{
      micro.addProcedure({
        load: ['error'],
        start: function() {
          setTimeout(()=>{
            try {
              this.load.error.throw();
              console.error('There is a Error in trown Function. Thats is very bad, dont you think?')
            } catch(e) {
              expect(e instanceof Error).to.be.equals(true)
              this.load.error.handle(e);
              const tail = spawn('tail', ['-1','log/info.log']);
              tail.stdout.on('data', (data) => {
                const err_built = JSON.parse(data.toString());
                expect(err_built.name).to.be.equals('logger');
                expect(err_built.msg).to.be.equals('Error! Type: Generic Operational Error | Description: No description was provided for this error.');
                done();
              });
            }
          }, 10);
        },
      }).start();
    })
  })

})
