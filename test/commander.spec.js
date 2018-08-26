'use strict'

const COMMON_TYPES = require('../lib/modules/error/commonTypes');

describe('COMMANDER', function() {

  let server
  let micro

  before(function(done) {
    console.warn('Running a docker instance of event store using docker as We believe you have installed docker-ce and followed the post-installatin steps so your current user can run a command like "docker ps"');
    console.warn('This can take a very big while if you are running the test script for the first time. If your docker is running okay just calm down and relax! It takes long..');
    this.timeout(Infinity);
    const process = spawn('scripts/RunEventStoreDocker.sh')
    process.stdout.on('data', data=>{console.log(data.toString());})
    process.on('close', code=>{
      if(code) throw code;
      else setTimeout(()=>{
        this.timeout(10000);
        server = MicroserviceTestServer(done);
      }, 5000);
    })
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
      load: ['commander'],
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.procedures.should.contain.a.thing.with.property('load');
      expect( micro.procedures.filter(procedure=>!!procedure.load.commander).length ).to.be.at.least(1);
      done()
    });
  })

  it('Should confirm a command added', function(done) {
    micro.addProcedure({
      load: ['commander'],
      start: async function() {
        expect(this.load.commander).to.be.exists()
        await this.load.commander.addCommand('test simple command', require('./rules/simple_rule'));
        expect(this.load.commander).to.be.exists()
        done()
      }
    }).start();
  })

  it('Should command with pre_validation', function(done) {
    const cmd = 'test command pre_validation';
    micro.addProcedure({
      load: ['commander'],
      start: async function() {
        await this.load.commander.addCommand(cmd, require('./rules/pre_validation_rule'));
      }
    }).start(()=>{
      micro.act(cmd, {pre_validation_field:'pre_valid'}, (err, ans)=>{
        expect(err).to.be.not.exists()
        done()
      })
    });
  })

  it('Should command with a graceful error when pre_validation missing', function(done) {
    const cmd = 'test command pre_validation missing';
    micro.addProcedure({
      load: ['commander'],
      start: async function() {
        await this.load.commander.addCommand(cmd, require('./rules/pre_validation_rule'));
      }
    }).start(()=>{
      micro.act(cmd, null, (err, ans)=>{
        expect(err).to.be.exists()
        done()
      })
    });
  })


  it('Should command with a graceful error when validation fails', function(done) {
    const cmd = 'test command validation';
    micro.addProcedure({
      load: ['commander'],
      start: async function() {
        await this.load.commander.addCommand(cmd, require('./rules/validation_rule'));
      }
    }).start(()=>{
      micro.act(cmd, {validation_field:'invalid'}, (err, ans)=>{
        expect(err).to.be.exists()
        done()
      })
    });
  })

  it('Should command with validation and pre_validation', function(done) {
    const cmd = 'test command validation and pre_validation';
    micro.addProcedure({
      load: ['commander'],
      start: async function() {
        await this.load.commander.addCommand(cmd, require('./rules/pre_validation_validation_rule'));
      }
    }).start(()=>{
      micro.act(cmd, { validation_field:'valid', pre_validation_field:'pre_valid' }, (err, ans)=>{
        expect(err).to.be.not.exists()
        done()
      })
    });
  })

  it('Should respond a command', function(done) {
    micro.addProcedure({
      load: ['commander'],
      start: async function() {
        await this.load.commander.addCommand('test command respond', require('./rules/respond_rule'));
      }
    }).start(()=>{
      micro.act('test command respond', (err, res)=>{
        expect(err).to.be.not.exists()
        expect(res).to.be.equals('SIMPLE RESPONSE')
        done()
      })
    });
  })

  it('Should respond a command with pre_validation success', function(done) {
    const command_call = 'test command pre_validation_success';
    micro.addProcedure({
      load: ['commander'],
      start: async function() {
        await this.load.commander.addCommand(command_call, require('./rules/pre_validation_respond_rule'));
      }
    }).start(()=>{
      micro.act(command_call, { pre_validation_field:'pre_valid', data:'sensible_data' }, (err, res)=>{
        expect(err).to.be.not.exists()
        expect(res).to.be.equals('SIMPLE RESPONSE');
        done()
      })
    });
  })

  it('Should respond a command with pre_validation failure', function(done) {
    const command_call = 'test command pre_validation_failure';
    micro.addProcedure({
      load: ['commander'],
      start: async function() {
        await this.load.commander.addCommand(command_call, require('./rules/pre_validation_respond_rule'));
      }
    }).start(()=>{
      micro.act(command_call, { pre_validation_field:'pre_invalid', data:'sensible_data' }, (err, res)=>{
        expect(err).to.be.exists()
        expect(err instanceof Error).to.be.equals(true)
        expect(err.commonType).to.be.equals(COMMON_TYPES.PRE_VALIDATION_RULE_BROKEN)
        done()
      })
    });
  })

  it('Should respond a command with validation success', function(done) {
    const command_call = 'test command validation_success';
    micro.addProcedure({
      load: ['commander'],
      start: async function() {
        await this.load.commander.addCommand(command_call, require('./rules/validation_respond_rule'));
      }
    }).start(()=>{
      micro.act(command_call, { validation_field:'valid', data:'sensible_data' }, (err, res)=>{
        expect(err).to.be.not.exists()
        expect(res).to.be.equals('SIMPLE RESPONSE');
        done()
      })
    });
  })

  it('Should respond a command with validation failure', function(done) {
    const command_call = 'test command validation_failure';
    micro.addProcedure({
      load: ['commander'],
      start: async function() {
        await this.load.commander.addCommand(command_call, require('./rules/validation_respond_rule'));
      }
    }).start(()=>{
      micro.act(command_call, { validation_field:'invalid', data:'sensible_data' }, (err, res)=>{
        expect(err).to.be.exists()
        expect(err instanceof Error).to.be.equals(true)
        expect(err.commonType).to.be.equals(COMMON_TYPES.VALIDATION_RULE_BROKEN)
        done()
      })
    });
  })

})
