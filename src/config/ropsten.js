const WtJsLibs = require('@windingtree/wt-js-libs');
const SwarmAdapter = require('@windingtree/off-chain-adapter-swarm');
const HttpAdapter = require('@windingtree/off-chain-adapter-http');
const winston = require('winston');

module.exports = {
  wtIndexAddress: '0x09C0AECBA9BBEBCCDAAF3FE8473591A69C4C11BE',
  port: 3000,
  wtLibs: WtJsLibs.createInstance({
    dataModelOptions: {
      provider: 'https://ropsten.infura.io/WKNyJ0kClh8Ao5LdmO7z',
    },
    offChainDataOptions: {
      adapters: {
        'bzz-raw': {
          options: {
            swarmProviderUrl: 'https://swarm-gateways.net/',
          },
          create: (options) => {
            return new SwarmAdapter(options);
          },
        },
        https: {
          create: () => {
            return new HttpAdapter();
          },
        },
      },
    },
  }),
  whiteList: [],
  logger: winston.createLogger({
    level: 'debug',
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  }),
};
