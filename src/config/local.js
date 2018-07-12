const { deployIndex } = require('../../scripts/local-network');

module.exports = {
  port: 3000,
  // log: true,
  web3Provider: 'http://localhost:8545',
  swarmProviderUrl: 'http://localhost:8500',
  whiteList: [],
  networkSetup: () => {
    deployIndex();
  },
};
