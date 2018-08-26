'use strict'

describe('EVT', function() {

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
      }, 1000);
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
      load: ['evt'],
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.procedures.should.contain.a.thing.with.property('load');
      expect( micro.procedures.filter(procedure=>!!procedure.load.evt).length ).to.be.at.least(1);
      done()
    });
  })

  it('Should send an event to EventStore and grab the event number', function(done) {
    let evt_command = 'strange event just to test'
    let evt_payload = { strange_event_property: 'lulu_balandia', strange_not_really_a_password: 'tomates_secos' }
    micro.addProcedure({
      load: ['evt'],
      start: async function() {
        this.load.evt.send(evt_command, evt_payload).then(event_number=>{
          expect(event_number).to.be.exists()
          done()
        })
      }
    }).start();
  })

  it('Should send an event to EventStore, grab the event number and recover it as sent', function(done) {
    let evt_command = 'strange event just to test again'
    let evt_payload = { strange_event_property: 'lulu_balandialandia', strange_not_really_a_password: 'tomates_secos_vermelhos' }
    micro.addProcedure({
      load: ['evt'],
      start: async function() {
        this.load.evt.send(evt_command, evt_payload).then(event_number=>{
          expect(event_number).to.be.exists()
          this.load.evt.get(event_number).then(event_got=>{
            expect(event_got).to.be.exists()
            expect(event_got).to.be.equals(evt_payload)
            done()
          })
        })
      }
    }).start();
  })

})
