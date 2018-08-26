const rule = {};

rule.validation = async function(data) {
  if(!data) return 'MISSING PAYLOAD';
  if(!data.validation_field) return 'NO VALIDATION';
  if(data.validation_field!='valid') return 'NO VALID';
  return false;
}

module.exports = rule;
