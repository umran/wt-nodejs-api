const CONFIG = require('./configuration');

class Config {
  constructor (context) {
    this.context = context;
  }
  set (key, value) {
    this.context[key] = value;
  }
  get (key) {
    return this.context[key];
  }
}

let config;
if (process.env.ETH_NETWORK && CONFIG[process.env.ETH_NETWORK]) {
  config = new Config(CONFIG[process.env.ETH_NETWORK]);
} else {
  config = new Config(CONFIG[CONFIG.defaultNetwork]);
}

module.exports = config;
