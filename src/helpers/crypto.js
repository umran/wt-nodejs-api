const fs = require('fs');
const Web3 = require('web3');
const config = require('../config');
const web3 = new Web3(config.get('web3provider'));

function loadAccount (dir) {
  let privateKeyString = fs.readFileSync(dir, 'utf8');
  return JSON.parse(privateKeyString);
}

function updateAccount (oldPassword, newPassword, privateKeyJSON, writeTo) {
  if (!newPassword) {
    newPassword = oldPassword;
  }
  if (!writeTo) {
    writeTo = config.get('privateKeyFile');
  }

  const { privateKey } = web3.eth.accounts.decrypt(privateKeyJSON, oldPassword);
  const cryptedAccount = web3.eth.accounts.encrypt(privateKey, newPassword);
  fs.writeFileSync(writeTo, JSON.stringify(cryptedAccount), 'utf8');
}

function storeWallet (wallet) {
  fs.writeFileSync(config.get('privateKeyFile'), JSON.stringify(wallet), 'utf8');
}
module.exports = {
  loadAccount,
  storeWallet,
  updateAccount,
};
