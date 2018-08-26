function ConfigServerModule() {
  this.load = ['add', 'util']
  this.config = {}

  this.setConfig = (config) => { this.config = config; }

  this.includePing = () => { this.load.add('get config ping', (req, cb)=>{ cb(null, 'pong'); }) }

  this.includeSetConfig = () => {
    this.load.add('set config', (req, cb)=>{
      this.config = this.load.util.mergeDeep(this.config, req)
      cb(null)
    })
  }

  this.includeGetConfig = () => {
    this.load.add('get config', (req, cb)=>{
      if(req && typeof req == 'string') {
        let ans = this.config;
        req.split(' ').forEach(ind => ans = ans[ind])
        cb(null, ans)
      } else cb(null, this.config)
    })
  }

  this.start = () => {
    this.includePing()
    this.includeGetConfig()
    this.includeSetConfig()
  }

}

module.exports = function() { return new ConfigServerModule() };
