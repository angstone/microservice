const rule = {};

rule.pre_validation = async function(data) {
  if(data.pre_validation_field!='pre_valid') return 'NO PRE_VALID';
  return false;
}

rule.respond = async function(data) {
  return 'SIMPLE RESPONSE';
}

module.exports = rule;
