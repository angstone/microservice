const env = {

  redis: {
    host: 'localhost',
    port: 6379
  },

  seneca_redis_config: {
    ...this.redis,
    type:'redis'
  },

};

module.exports = env;
