const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const config = require('../config');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const loadKeyFile = async (uuid) => {
  try {
    return JSON.parse(await readFile(path.resolve(config.get('keyFileStorage'), `${uuid}.json`), 'utf8'));
  } catch (e) {
    throw new Error('Wallet not found:' + e.message);
  }
};

const storeKeyFile = async (wallet) => {
  // store under ${wallet.id}.json as per https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
  const location = path.resolve(config.get('keyFileStorage'), `${wallet.id}.json`);
  try {
    await writeFile(
      location,
      JSON.stringify(wallet),
      { encoding: 'utf8', flag: 'w' }
    );
  } catch (e) {
    throw new Error('Wallet cannot be stored:' + e.message);
  }
};

const removeKeyFile = async (uuid) => {
  try {
    await unlink(path.resolve(config.get('keyFileStorage'), `${uuid}.json`));
  } catch (e) {
    throw new Error('Wallet cannot be removed:' + e.message);
  }
};

module.exports = {
  loadKeyFile,
  storeKeyFile,
  removeKeyFile,
};
