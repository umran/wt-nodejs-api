const winston = require('winston');

module.exports = {
  port: 8100,
  web3Provider: 'http://localhost:8545',
  swarmProviderUrl: 'http://localhost:8500',
  whiteList: [
    '127.0.0.1',
  ],
  logger: winston.createLogger({
    level: 'debug',
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  }),
};
