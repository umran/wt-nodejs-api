const CONFIG = require('./config.json');
const Web3 = require('web3');

class Config {
  constructor (context) {
    this.context = context;
    this.context.web3 = new Web3(new Web3.providers.HttpProvider(context.web3Provider));
  }
  set (key, value) {
    this.context[key] = value;
  }

  get (key) {
    return this.context[key];
  }
  updateWeb3Provider () {
    this.context.web3 = new Web3(new Web3.providers.HttpProvider(this.context.web3Provider));
  }
}
const config = new Config(CONFIG);

module.exports = config;
