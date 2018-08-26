const msg = require('./auth_signup_messages');

const rule = {};

rule.models = ['user','session'];

rule.pre_validation = async function(data) {
  if(!data) return msg.NO_PAYLOAD;
  if(!data.name) return msg.NO_NAME;
  if(!data.login) return msg.NO_LOGIN;
  if(!data.password) return msg.NO_PASSWORD;
  if(!data.password_confirmation) return msg.NO_PASSWORD_CONFIRMATION;
  // enshures 2 words
  if( !/\b\w+\b(?:.*?\b\w+\b){1}/.test(data.name) ) return msg.WRONG_NAME;
  // enshures 3 letter
  if( !/(.*[a-zA-Z]){3}/.test(data.name) ) return msg.WRONG_NAME;
  // enshures 6 digits regular login
  if( !/^\w{6,}$/.test(data.login) ) return msg.WRONG_LOGIN;
  // enshures 8 digits password
  if( !/^\S{8,}$/.test(data.password) ) return msg.WRONG_PASSWORD;
  if(data.password != data.password_confirmation) return msg.WRONG_PASSWORD_CONFIRMATION;
  return false;
};

rule.validation = async function(data) {
  const user_taken = this.models.user.data({login:data.login}).first();
  if(user_taken) return msg.LOGIN_TAKEN;
  return false;
};

rule.respond = async function(data) {
  /*this.models.user.create(op.data).findByLogin((err, taken)=>{
    if(err) cb('INTERNAL ERROR');
    else if(taken) cb(null, taken);
    else cb(null, null);
  });*/
  return 'token';
};

module.exports = rule;
