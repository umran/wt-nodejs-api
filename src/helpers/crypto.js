const fs = require('fs')
const Web3 = require('web3')
const CONFIG = require('../../config.json')

const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider))

function loadAccount (dir) {
  let privateKeyString = fs.readFileSync(dir, 'utf8')
  return JSON.parse(privateKeyString)
}

function updateAccountPassword (oldPassword, newPassword, privateKeyJSON, writeTo = CONFIG.privateKeyDir) {
  const { privateKey } = web3.eth.accounts.decrypt(privateKeyJSON, oldPassword)
  const cryptedAccount = web3.eth.accounts.encrypt(privateKey, newPassword)
  fs.writeFileSync(writeTo, JSON.stringify(cryptedAccount), 'utf8')
}

module.exports = {
  loadAccount,
  updateAccountPassword
}
