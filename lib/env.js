module.exports = {

  hemera_logLevel: 'info',

  nats_url: process.env.NATS_URL ||  'nats://nats:4222',
  nats_user: process.env.NATS_USER || 'nats_user',
  nats_pass: process.env.NATS_PW || 'nats_user_pw',

  mock: false,

};
