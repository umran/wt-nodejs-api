/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const TruffleContract = require('truffle-contract');
const Web3 = require('web3');
const config = require('../../src/config');
const {
  HOTEL_DESCRIPTION,
} = require('./constants.js');

// dirty hack for web3@1.0.0 support for localhost testrpc, see
// https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
function hackInSendAsync (instance) {
  if (typeof instance.currentProvider.sendAsync !== 'function') {
    instance.currentProvider.sendAsync = function () {
      return instance.currentProvider.send.apply(
        instance.currentProvider,
        arguments
      );
    };
  }
  return instance;
}

function getContractWithProvider (metadata, provider) {
  let contract = new TruffleContract(metadata);
  contract.setProvider(provider);
  contract = hackInSendAsync(contract);
  return contract;
}
const provider = new Web3.providers.HttpProvider(config.get('web3Provider'));
const WTIndex = getContractWithProvider(
  require('@windingtree/wt-contracts/build/contracts/WTIndex'),
  provider
);

const deployIndex = async () => {
  const index = await WTIndex.new({
    from: config.get('user'),
    gas: 6000000,
  });
  config.set('indexAddress', index.address);
  config.set('index', index);
};

const deployFullHotel = async (WtLibs) => {
  const jsonClient = await WtLibs.getOffChainDataClient('json');
  const descriptionUri = await jsonClient.upload(HOTEL_DESCRIPTION);
  const dataUri = await jsonClient.upload({
    descriptionUri,
  });

  let index = config.get('index');
  const registerResult = await index.registerHotel(dataUri, {
    from: config.get('user'),
    gas: 6000000,
  });
  return registerResult.logs[0].args.hotel;
};

module.exports = {
  deployIndex,
  deployFullHotel,
};
