const fs = require('fs');
const Web3 = require('web3');
const CONFIG = require('../../config.json');

const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider));

function loadAccount(dir) {
  let privateKeyString = fs.readFileSync(dir, "utf8");
  let privateKeyJSON = JSON.parse(privateKeyString);
  return privateKeyJSON
}

function decrypt(password, privateKeyJSON) {
  return web3.eth.accounts.decrypt(privateKeyJSON, password);
};

function encrypt(oldPassword, newPassword, privateKeyJSON, writeTo){
  const {privateKey} = decrypt(oldPassword, privateKeyJSON);
  const cryptedAccount = web3.eth.accounts.encrypt(privateKey, newPassword);
  fs.writeFileSync(writeTo, JSON.stringify(cryptedAccount), "utf8");
}

module.exports = {
  decrypt: decrypt,
  encrypt: encrypt,
  loadAccount: loadAccount
};
