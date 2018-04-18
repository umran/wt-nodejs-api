const CONFIG = require('./configuration');
const Web3 = require('web3');
const { web3providerFactory } = require('@windingtree/wt-js-libs');

class Config {
  constructor (context) {
    this.context = context;
    const instancedWeb3 = new Web3(new Web3.providers.HttpProvider(context.web3Provider));
    this.context.web3provider = web3providerFactory.getInstance(instancedWeb3);
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
