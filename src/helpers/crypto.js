const fs = require('fs');
const Web3 = require('web3');
const CONFIG = require('../../config.json');
const config = require('../../config.js');
const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider));

function loadAccount (dir) {
  let privateKeyString = fs.readFileSync(dir, 'utf8');
  return JSON.parse(privateKeyString);
}

function updateAccount (oldPassword, newPassword, privateKeyJSON, writeTo = CONFIG.privateKeyDir) {
  if (!newPassword) newPassword = oldPassword;
  const { privateKey } = web3.eth.accounts.decrypt(privateKeyJSON, oldPassword);
  const cryptedAccount = web3.eth.accounts.encrypt(privateKey, newPassword);
  fs.writeFileSync(writeTo, JSON.stringify(cryptedAccount), 'utf8');
}

function storeWallet (wallet) {
  fs.writeFileSync(config.get('privateKeyDir'), JSON.stringify(wallet), 'utf8');
}
module.exports = {
  loadAccount,
  storeWallet,
  updateAccount,
};
