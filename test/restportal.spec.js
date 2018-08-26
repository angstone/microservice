'use strict'

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('RESTPORTAL', () => {

  let server
  let configServer
  let restportal

  before(function(done) {
    server = MicroserviceTestServer(()=>{
      configServer = require('../samples/config-server');
      configServer.start(()=>{
        restportal = require('../samples/restportal');
        done();
      });
    });
  })

  after(function(done) {
    restportal.close(()=>{
      configServer.close(()=>{
        server.kill();
        done();
      });
    });
  })

  describe('/GET ping', () => {

    it('RESTPORTAL should GET a ping', (done) => {
      chai.request(restportal)
        .get('/ping')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('string');
          res.body.should.be.eql('pong');
          done();
        });
    });

  });

  describe('/GET ping-config', () => {

    it('RESTPORTAL should GET a ping on config server', (done) => {
      chai.request(restportal)
        .get('/ping-config')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('string');
          res.body.should.be.eql('pong');
          done();
        });
    });

  });

});
