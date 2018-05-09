const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { promisify } = require('util');

const config = require('../config');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const CIPHER_ALGORITHM = 'aes-256-cbc';

const serializeContents = (contents) => {
  const stringifiedContents = JSON.stringify(contents);
  const cipher = crypto.createCipher(CIPHER_ALGORITHM, config.get('secret'));
  let crypted = cipher.update(stringifiedContents, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return CIPHER_ALGORITHM + ':' + crypted;
};

const deserializeContents = (contents) => {
  const splitContents = contents.split(':');
  const cipher = splitContents[0];
  const encodedJson = splitContents.slice(1).join('');
  if (cipher !== CIPHER_ALGORITHM) {
    throw new Error(`Unsupported cipher ${cipher}, we only support ${CIPHER_ALGORITHM} for now.`);
  }
  try {
    const decipher = crypto.createDecipher(CIPHER_ALGORITHM, config.get('secret'));
    let deciphered = decipher.update(encodedJson, 'hex', 'utf8');
    deciphered += decipher.final('utf8');
    return JSON.parse(deciphered);
  } catch (e) {
    throw new Error('Cannot decipher keyfile:' + e.message);
  }
};

const loadKeyFile = async (uuid) => {
  try {
    return deserializeContents(await readFile(path.resolve(config.get('keyFileStorage'), `${uuid}.enc`), 'utf8'));
  } catch (e) {
    throw new Error('Wallet not found:' + e.message);
  }
};

const storeKeyFile = async (wallet) => {
  // store under ${wallet.id}.json as per https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
  const location = path.resolve(config.get('keyFileStorage'), `${wallet.id}.enc`);
  try {
    await writeFile(
      location,
      serializeContents(wallet),
      { encoding: 'utf8', flag: 'w' }
    );
  } catch (e) {
    throw new Error('Wallet cannot be stored:' + e.message);
  }
};

const removeKeyFile = async (uuid) => {
  try {
    await unlink(path.resolve(config.get('keyFileStorage'), `${uuid}.enc`));
  } catch (e) {
    throw new Error('Wallet cannot be removed:' + e.message);
  }
};

module.exports = {
  loadKeyFile,
  storeKeyFile,
  removeKeyFile,
};
