const rule = {};

rule.pre_validation = async function(data) {
  if(!data) return 'MISSING PAYLOAD';
  if(!data.pre_validation_field) return 'MISSING PRE_VALIDATION FIELD';
  if(data.pre_validation_field!='pre_valid') return 'NO PRE_VALID';
  return false;
}

module.exports = rule;
