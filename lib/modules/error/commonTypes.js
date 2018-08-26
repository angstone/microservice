const COMMON_TYPES = {
  UNKNOWN: 'Unknown Error',
  DEVELOPMENT: 'Development Error',
  GENERIC_OPERATIONAL: 'Generic Operational Error',
  PATTERN_NOT_FOUND: 'No action found for this pattern',
  SYSTEM_JS_NOT_FOUND: 'A System JS file needed was not found or provided',
  RULER_MODULE_FAILURE: 'Ruler Module Failure',
  PRE_VALIDATION_RULE_BROKEN: 'Your data broke a pre-validation business rule',
  VALIDATION_RULE_BROKEN: 'Your data broke a validation business rule',
  EVENT_STORE_BAD_STATUS: 'Event Store response was not 201',
};

module.exports = COMMON_TYPES;
