/* eslint-env mocha */
const TruffleContract = require('truffle-contract');
const Web3 = require('web3');
const config = require('../../src/config');
const {
  HOTEL_DESCRIPTION,
  RATE_PLAN,
} = require('./test-data');

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
const provider = new Web3.providers.HttpProvider(config.web3Provider);
const WTIndex = getContractWithProvider(
  require('@windingtree/wt-contracts/build/contracts/WTIndex'),
  provider
);

const deployIndex = async () => {
  const index = await WTIndex.new({
    from: config.user,
    gas: 6000000,
  });
  // TODO drop dependency on config
  config.indexAddress = index.address;
  config.index = index;
};

const deployFullHotel = async (WtLibs) => {
  const jsonClient = await WtLibs.getOffChainDataClient('json');
  const descriptionUri = await jsonClient.upload(HOTEL_DESCRIPTION);
  const ratePlansUri = await jsonClient.upload(RATE_PLAN);
  const dataUri = await jsonClient.upload({
    descriptionUri,
    ratePlansUri,
  });

  let index = config.index;
  const registerResult = await index.registerHotel(dataUri, {
    from: config.user,
    gas: 6000000,
  });
  return registerResult.logs[0].args.hotel;
};

module.exports = {
  deployIndex,
  deployFullHotel,
};
