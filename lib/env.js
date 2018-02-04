module.exports = {

  //hemera_logLevel: 'info',
  hemera_logLevel: 'fatal',
  hemera_timeout: 5000,

  nats_url: process.env.NATS_URL ||  'nats://nats:4222',
  nats_user: process.env.NATS_USER || 'nats_user',
  nats_pass: process.env.NATS_PW || 'nats_user_pw',

  mock: false,

  es_gateway: process.env.ES_GATEWAY || 'http://eventstore:2113',
  es_host: process.env.ES_HOST || '127.0.0.1',
  es_port: process.env.ES_PORT || 1113,
  es_debug: process.env.ES_DEBUG || true,
  es_username: process.env.ES_USERNAME || 'admin',
  es_password: process.env.ES_PASSWORD || 'changeit',

};
