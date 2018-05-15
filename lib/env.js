const appRoot = require('app-root-path');

module.exports = {

  debug: process.env.DEBUG || false,

  rules: appRoot+'/'+(process.env.RULES || '../rules'),
  models: appRoot+'/'+(process.env.MODELS || '../models'),

  //hemera_logLevel: 'info',
  hemera_logLevel: 'error',
  hemera_timeout: 2000,
  hemera_message_timeout: 1000,

  nats_url: process.env.NATS_URL ||  'nats://nats:4222',
  nats_user: process.env.NATS_USER || 'nats_user',
  nats_pass: process.env.NATS_PW || 'nats_user_pw',

  mock: false,

  es_gateway: process.env.ES_GATEWAY || 'http://eventstore:2113',
  es_host: process.env.ES_HOST || 'eventstore',
  es_port: process.env.ES_PORT || 1113,
  es_debug: process.env.ES_DEBUG || false,
  es_username: process.env.ES_USERNAME || 'admin',
  es_password: process.env.ES_PASSWORD || 'changeit',

  mongodb_host: process.env.MONGODB_HOST || 'mongodb://mongodb/',

  elastic_hosts: process.env.ELASTIC_HOSTS ? process.env.ELASTIC_HOSTS.split(',') : ['http://elasticsearch:9200'],
  elastic_httpAuth: process.env.ELASTIC_HTTP_AUTH || null,
  elastic_log: process.env.ELASTIC_LOG || 'warning',
  elastic_pingTimeout: process.env.ELASTIC_PING_TIMEOUT || 3000,
  elastic_ssl: {
    pfx: process.env.ELASTIC_SSL_PFX || null,
    key: process.env.ELASTIC_SSL_KEY || null,
    passphrase: process.env.ELASTIC_SSL_PASSPHRASE || null,
    cert: process.env.CERT || null,
    ca: process.env.ELASTIC_SSL_CA || null,
    ciphers: process.env.ELASTIC_SSL_CIPHERS || null,
    rejectUnauthorized: process.env.ELASTIC_SSL_REJECT_UNAUTHORIZED || false,
    secureProtocol: process.env.ELASTIC_SSL_SECURE_PROTOCOL || null
  },

};
