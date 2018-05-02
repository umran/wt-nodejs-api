const WtJsLibs = require('@windingtree/wt-js-libs');

let wtJsLibsInstance;

function initialize (web3Provider) {
  wtJsLibsInstance = WtJsLibs.createInstance({
    // web3-json data model type is hardcoded for now
    // subject to change
    dataModelType: 'web3-json',
    dataModelOptions: {
      provider: web3Provider,
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
