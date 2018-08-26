const uid = require('uuid/v1');
const fetch = require('node-fetch');

function Evt() {
  this.load = ['env', 'error'];

  this.send = async function(type, payload=null, stream=null) {
    const evt = {};
    evt.type = type;
    evt.stream = stream ? stream : this.load.env.app_topic;
    evt.payload = payload;

    const url = this.load.env.event_source_gateway+'/streams/'+evt.stream;
    const method = 'POST';
    const event_data = {
      eventType: evt.type,
      eventId: uid(),
      data: evt.payload
    };
    const body = JSON.stringify([event_data]);
    const headers = { 'Content-Type': 'application/vnd.eventstore.events+json' };
    const response = await fetch(url, {method, headers, body});
    if(response.status==201) return response.headers.get('location').split("/").slice(-1)[0]; // The Event Number
    else {
      const error = this.load.error.is(this.load.error.COMMON_TYPES.EVENT_STORE_BAD_STATUS, 'Event Store could not absorb the event: '+evt.type);
      error.response = response;
      throw error;
    }
  }

  this.get = async function(event_number, stream=null) {
    stream = stream ? stream : this.load.env.app_topic;
    const url = this.load.env.event_source_gateway+'/streams/'+stream+'/'+event_number;
    const method = 'GET';
    const headers = { 'Accept': 'application/json' };
    return fetch(url, {method, headers}).then(res=>res.json())
  }
};

module.exports = function() { return new Evt() };
