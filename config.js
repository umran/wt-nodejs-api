const CONFIG = require('./config.json');
const Web3 = require('web3');
const { web3providerFactory } = require('@windingtree/wt-js-libs');

class Config {
  constructor (context) {
    this.context = context;
    const instancedWeb3 = new Web3(new Web3.providers.HttpProvider(context.web3Provider));
    this.context.web3 = web3providerFactory.getInstance(instancedWeb3);
  }
  set (key, value) {
    this.context[key] = value;
  }
  get (key) {
    return this.context[key];
  }
  updateWeb3Provider () {
    const instancedWeb3 = new Web3(new Web3.providers.HttpProvider(this.context.web3Provider));
    this.context.web3 = web3providerFactory.getInstance(instancedWeb3);
  }
}
const config = new Config(CONFIG);

module.exports = config;
