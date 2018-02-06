module.exports = function(err) {
  const MicroError = require("nats-hemera").createError("Microservice Error");
  return new MicroError(err);
};
