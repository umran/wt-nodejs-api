/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const TruffleContract = require('truffle-contract');
const Web3 = require('web3');

const config = require('../../src/config');
const { app } = require('../../src/app');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000000000000000000000000000';
let server;

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
const provider = new Web3.providers.HttpProvider(config.get('web3Provider'));
const WTIndex = getContractWithProvider(require('@windingtree/wt-contracts/build/contracts/WTIndex'), provider);

const BeforeEach = () => (
  beforeEach(async function () {
    const index = await WTIndex.new({
      from: config.get('user'),
      gas: 6000000,
    });
    expect(index.address).to.not.equal(ZERO_ADDRESS);
    config.set('indexAddress', index.address);
    server = await app.listen(3000);
    const hotelUrl = 'ipfs://some-random-hash';
    const registerResult = await index.registerHotel(hotelUrl, {
      from: config.get('user'),
      gas: 6000000,
    });
    config.set('testAddress', registerResult.logs[0].args.hotel);
  })
);

const AfterEach = () => (
  afterEach(async function () {
    return server.close();
  })
);

module.exports = {
  AfterEach,
  BeforeEach,
};
