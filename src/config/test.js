const WtJsLibs = require('@windingtree/wt-js-libs');
const InMemoryAdapter = require('@windingtree/off-chain-adapter-in-memory');
const winston = require('winston');

module.exports = {
  port: 8100,
  wtIndexAddress: 'will-be-set-during-init',
  wtLibs: WtJsLibs.createInstance({
    dataModelOptions: {
      provider: 'http://localhost:8545',
    },
    offChainDataOptions: {
      adapters: {
        json: {
          options: { },
          create: (options) => {
            return new InMemoryAdapter(options);
          },
        },
      },
    },
  }),
  whiteList: [
    '127.0.0.1',
  ],
  logger: winston.createLogger({
    level: 'debug',
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
        handleExceptions: true,
      }),
    ],
  }),
};
