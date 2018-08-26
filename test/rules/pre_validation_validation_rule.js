const rule = {};

rule.pre_validation = async function(data) {
  if(!data) return 'MISSING PAYLOAD';
  if(!data.pre_validation_field) return 'MISSING PRE_VALIDATION FIELD';
  if(data.pre_validation_field!='pre_valid') return 'NO PRE_VALID';
  return false;
}

rule.validation = async function(data) {
  if(!data) return 'MISSING PAYLOAD';
  if(!data.validation_field) return 'NO VALIDATION';
  if(data.validation_field!='valid') return 'NO VALID';
  return false;
}

module.exports = rule;
