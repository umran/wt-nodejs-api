const { deployIndex } = require('../../scripts/local-network');

const winston = require('winston');

module.exports = {
  port: 3000,
  web3Provider: 'http://localhost:8545',
  swarmProviderUrl: 'http://localhost:8500',
  whiteList: [],
  networkSetup: () => {
    deployIndex();
  },
  logger: winston.createLogger({
    level: 'debug',
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  }),
};
