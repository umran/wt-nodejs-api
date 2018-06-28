const WtJsLibs = require('@windingtree/wt-js-libs');
const InMemoryAdapter = require('@windingtree/off-chain-adapter-in-memory').adapter;
const SwarmAdapter = require('@windingtree/off-chain-adapter-swarm').adapter;
const HttpAdapter = require('@windingtree/off-chain-adapter-http').adapter;
let wtJsLibsInstance;

function initialize (web3Provider) {
  wtJsLibsInstance = WtJsLibs.createInstance({
    // web3-json data model type is hardcoded for now
    // subject to change
    dataModelType: 'web3-json',
    dataModelOptions: {
      provider: web3Provider,
    },
    offChainDataOptions: {
      adapters: {
        json: {
          options: { },
          create: (options) => {
            return new InMemoryAdapter(options);
          },
        },
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
  });
}

function getInstance () {
  if (!wtJsLibsInstance) {
    throw new Error('You need to call initialize first');
  }
  return wtJsLibsInstance;
}

module.exports = {
  initialize,
  getInstance,
};
