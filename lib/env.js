//const appRoot = require('app-root-path');

function Env() {
  this.app_topic = process.env.APP_TOPIC || 'as';

  this.production = process.env.PRODUCTION || false;

  this.debug = process.env.DEBUG || this.production ? false : true;

  this.log_info_in_file = process.env.LOG_INFO_IN_FILE || true;
  this.log_error_in_file = process.env.LOG_ERROR_IN_FILE || true;
  this.log_info_file_life = process.env.LOG_INFO_FILE_LIFE || 3;
  this.log_error_file_life = process.env.LOG_ERROR_FILE_LIFE || 10;
  this.log_file_path = process.env.LOG_FILE_PATH || 'log';

  this.nats_url = process.env.NATS_URL || 'nats://localhost:4222';
  this.nats_user = process.env.NATS_USER || 'ruser';
  this.nats_pass = process.env.NATS_PW || 'T0pS3cr3t';

  this.hemera_logLevel = process.env.HEMERA_LOG_LEVEL || this.debug ? 'error' : 'fatal';
  this.hemera_timeout = process.env.HEMERA_TIMEOUT || this.debug ? 4000 : 8000;

  //rules: appRoot+'/'+(process.env.RULES || '../rules'),
  //models: appRoot+'/'+(process.env.MODELS || '../models'),

  this.event_source_gateway = process.env.EVENT_SOURCE_GATEWAY || 'http://localhost:2113';

  //mock: false,

  //es_gateway: process.env.ES_GATEWAY || 'http://eventstore:2113',
  //es_host: process.env.ES_HOST || 'eventstore',
  //es_port: process.env.ES_PORT || 1113,
  //es_debug: process.env.ES_DEBUG || false,
  //es_username: process.env.ES_USERNAME || 'admin',
  //es_password: process.env.ES_PASSWORD || 'changeit',

  //mongodb_host: process.env.MONGODB_HOST || 'mongodb://mongodb/',

  //elastic_hosts: process.env.ELASTIC_HOSTS ? process.env.ELASTIC_HOSTS.split(',') : ['http://elasticsearch:9200'],
  //elastic_httpAuth: process.env.ELASTIC_HTTP_AUTH || null,
  //elastic_log: process.env.ELASTIC_LOG || 'warning',
  //elastic_pingTimeout: process.env.ELASTIC_PING_TIMEOUT || 3000,
  //elastic_ssl: {
  //  pfx: process.env.ELASTIC_SSL_PFX || null,
  //  key: process.env.ELASTIC_SSL_KEY || null,
  //  passphrase: process.env.ELASTIC_SSL_PASSPHRASE || null,
  //  cert: process.env.CERT || null,
  //  ca: process.env.ELASTIC_SSL_CA || null,
  //  ciphers: process.env.ELASTIC_SSL_CIPHERS || null,
  //  rejectUnauthorized: process.env.ELASTIC_SSL_REJECT_UNAUTHORIZED || false,
  //  secureProtocol: process.env.ELASTIC_SSL_SECURE_PROTOCOL || null
  //},
}

module.exports = function() {
  return new Env();
};
