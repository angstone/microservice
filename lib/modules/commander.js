function CommanderModule() {
  this.load = ['add', 'ruler', 'error', 'evt'];

  this.addCommand = async function(command_name, rule_sheet=null) {
    let command = { command: command_name, rule_sheet };
    try {
      command.rule = await this.load.ruler.loadRule(command.rule_sheet);
    } catch(e) {
      this.load.error.throwFatal(this.load.error.COMMON_TYPES.RULER_MODULE_FAILURE, 'The ruler module could not load the rule_sheet js object: '+JSON.stringify(rule_sheet));
    }
    command = await this.addProcessesTo(command);
    return this.load.add(command_name, command.do);
  }

  this.respond = function(command, payload, cb) {
    if(command.rule.respond) {
      command.rule.respond(payload).then(data=>cb(null, data)).catch(err=>{
        if(command.errorDuringDispach) cb(command.errorDuringDispach)
        else cb(err)
      })
      this.load.evt.send(command.command, payload).catch(e=>{command.errorDuringDispach = e;}) // Dispatching the event, collect error and waiting for the response timeout error to tell client about it
    } else this.load.evt.send(command.command, payload).then(()=>cb(null,null)).catch(cb) // Dispatching the event and respond client
  }

  this.validate = function(command, payload, cb) {
    if(command.rule.validation) {
      command.rule.validation(payload).then(validation_rule_broken=>{
        if(validation_rule_broken) cb(this.load.error.is(this.load.error.COMMON_TYPES.VALIDATION_RULE_BROKEN, validation_rule_broken))
        else this.respond(command, payload, cb)
      }).catch(cb)
    } else this.respond(command, payload, cb)
  }

  this.preValidate = function(command, payload, cb) {
    if(command.rule.pre_validation) {
      command.rule.pre_validation(payload).then(pre_validation_rule_broken=>{
        if(pre_validation_rule_broken) cb(this.load.error.is(this.load.error.COMMON_TYPES.PRE_VALIDATION_RULE_BROKEN, pre_validation_rule_broken))
        else this.validate(command, payload, cb)
      }).catch(cb)
    } else this.validate(command, payload, cb)
  }


  this.addProcessesTo = async function(command) {
    command.do = (payload, cb) => {
      this.preValidate(command, payload, cb)
    }
    return command;
  }

}

module.exports = function() {
  return new CommanderModule();
};
