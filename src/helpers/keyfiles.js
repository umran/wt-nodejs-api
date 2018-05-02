const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const config = require('../config');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const loadKeyFile = async (uuid) => {
  // TODO deal with IO
  return JSON.parse(await readFile(path.resolve(config.get('keyFileStorage'), `${uuid}.json`), 'utf8'));
};

const storeKeyFile = async (wallet) => {
  // store under ${keyStoreV3.id}.json as per https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
  const location = path.resolve(config.get('keyFileStorage'), `${wallet.id}.json`);
  // TODO deal with IO
  await writeFile(
    location,
    JSON.stringify(wallet),
    { encoding: 'utf8', flag: 'w' }
  );
};

const removeKeyFile = async (uuid) => {
  // TODO deal with IO
  await unlink(path.resolve(config.get('keyFileStorage'), `${uuid}.json`));
};

module.exports = {
  loadKeyFile,
  storeKeyFile,
  removeKeyFile,
};
