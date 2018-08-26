'use strict'

describe('CONFIG SERVER', function() {

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
      load: ['configServer'],
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.procedures.should.contain.a.thing.with.property('load');
      expect( micro.procedures.filter(procedure=>!!procedure.load.configServer).length ).to.be.at.least(1);
      done()
    });
  })

  it('Should be able to respond ping', function(done) {
    micro.addProcedure({
      load: ['configServer'],
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.act('get config ping', (err, ans)=>{
        expect(err).not.to.be.exists()
        expect(ans).to.be.equals('pong')
        done()
      });
    });
  })

  it('Should be able to be created with a basic config and respond it', function(done) {
    const config = { lord: 'Jesus' };
    micro.addProcedure({
      load: ['configServer'],
      start: function() {
        this.load.configServer.setConfig(config);
      },
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.act('get config', (err, ans)=>{
        expect(err).not.to.be.exists()
        expect(ans).to.be.equals(config)
        done()
      });
    });
  })

  it('Should be able to set a config and respond it', function(done) {
    const config = { lord: 'Jesus Cristo' };
    micro.addProcedure({
      load: ['configServer'],
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.act('set config', config, (err, ans)=>{
        expect(err).not.to.be.exists()
        micro.act('get config', config, (err, ans)=>{
          expect(err).not.to.be.exists()
          expect(ans).to.be.equals(config)
          done()
        });
      });
    });
  })

  it('Should be able to set a deep config and respond it', function(done) {
    const config = { lord: 'Jesus Cristo The Lord', liveFor: 'mySelf' };
    const liveFor = 'love';
    micro.addProcedure({
      load: ['configServer'],
      start: function() {
        this.load.configServer.setConfig(config);
      },
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.act('set config', { liveFor }, (err, ans)=>{
        expect(err).not.to.be.exists()
        micro.act('get config', config, (err, ans)=>{
          expect(err).not.to.be.exists()
          expect(ans.lord).to.be.equals(config.lord)
          expect(ans.liveFor).to.be.equals(liveFor)
          done()
        });
      });
    });
  })

  it('Should be able to get a deep config', function(done) {
    const liveFor = 'Love Each Other';
    const config = { lord: 'Jesus Cristo The Lord Of My Life', liveFor };
    micro.addProcedure({
      load: ['configServer'],
      start: function() {
        this.load.configServer.setConfig(config);
      },
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.act('get config', 'liveFor', (err, ans)=>{
        expect(err).not.to.be.exists()
        expect(ans).to.be.equals(liveFor)
        done()
      });
    });
  })

  it('Should be able to set and get a very deep config', function(done) {
    let so = { it: { will: 'be nice' }, he: 'is'};
    let newAs = { many: 'as possible', so };
    let other = { as: 'nothing', after: 'nice' };
    let config = { lord: 'JC', liveFor: { love: { each: { other } }, share: { knowledge: 'a lot' } } };
    micro.addProcedure({
      load: ['configServer'],
      start: function() {
        this.load.configServer.setConfig(config);
      },
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.act('set config', { liveFor: { love: { each: { other: { as: newAs } } } } }, (err, ans)=>{
        expect(err).not.to.be.exists()
        micro.act('get config', 'liveFor love each other as so', (err, ans)=>{
          expect(err).not.to.be.exists()
          expect(ans).to.be.equals(so)
          config.liveFor.love.each.other.as = newAs;
          micro.act('get config', (err, ans)=>{
            expect(err).not.to.be.exists()
            expect(ans).to.be.equals(config);
            done()
          });
        });
      });
    });
  })

  it('Should be able to set and get a very deep config in this other scenary', function(done) {
    let love = 'love more';
    let config = { lord: 'JC', liveFor: { love: { each: { other:'as ourself' } }, share: { knowledge: 'a lot' } } };
    micro.addProcedure({
      load: ['configServer'],
      start: function() {
        this.load.configServer.setConfig(config);
      },
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.act('set config', { liveFor: { love } }, (err, ans)=>{
        expect(err).not.to.be.exists()
        micro.act('get config', 'liveFor love', (err, ans)=>{
          expect(err).not.to.be.exists()
          expect(ans).to.be.equals(love)
          config.liveFor.love = love;
          micro.act('get config', (err, ans)=>{
            expect(err).not.to.be.exists()
            expect(ans).to.be.equals(config);
            done()
          });
        });
      });
    });
  })

})
