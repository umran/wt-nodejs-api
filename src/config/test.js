const winston = require('winston');

module.exports = {
  port: 8100,
  web3Provider: 'http://localhost:8545',
  user: '0xd39ca7d186a37bb6bf48ae8abfeb4c687dc8f906',
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
