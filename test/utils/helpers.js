/* eslint-env mocha */
const TruffleContract = require('truffle-contract');
const Web3 = require('web3');
const config = require('../../src/config');
const WTIndexContract = require('@windingtree/wt-contracts/build/contracts/WTIndex');
const {
  HOTEL_DESCRIPTION,
  RATE_PLAN,
} = require('./test-data');

const provider = new Web3.providers.HttpProvider(config.web3Provider);
const web3 = new Web3(provider);

// dirty hack for web3@1.0.0 support for localhost testrpc, see
// https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
function hackInSendAsync (instance) {
  if (typeof instance.currentProvider.sendAsync !== 'function') {
    instance.currentProvider.sendAsync = function () {
      return instance.currentProvider.send.apply(
        instance.currentProvider, arguments
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

const deployIndex = async () => {
  const indexContract = getContractWithProvider(WTIndexContract, provider);
  const accounts = await web3.eth.getAccounts();
  const index = await indexContract.new({
    from: accounts[0],
    gas: 6000000,
  });
  config.wtIndexAddress = index.address;
  return index;
};

const deployFullHotel = async (offChainDataAdapter, index) => {
  const descriptionUri = await offChainDataAdapter.upload(HOTEL_DESCRIPTION);
  const ratePlansUri = await offChainDataAdapter.upload(RATE_PLAN);
  const accounts = await web3.eth.getAccounts();
  const dataUri = await offChainDataAdapter.upload({
    descriptionUri,
    ratePlansUri,
  });

  const registerResult = await index.registerHotel(dataUri, {
    from: accounts[0],
    gas: 6000000,
  });
  return registerResult.logs[0].args.hotel;
};

module.exports = {
  deployIndex,
  deployFullHotel,
};
