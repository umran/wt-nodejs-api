const WtJsLibs = require('@windingtree/wt-js-libs');
const InMemoryAdapter = require('@windingtree/off-chain-adapter-in-memory');
const SwarmAdapter = require('@windingtree/off-chain-adapter-swarm');
const HttpAdapter = require('@windingtree/off-chain-adapter-http');
let wtJsLibsInstance;

function initialize (web3Provider, swarmProviderUrl) {
  wtJsLibsInstance = WtJsLibs.createInstance({
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
            swarmProviderUrl,
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
