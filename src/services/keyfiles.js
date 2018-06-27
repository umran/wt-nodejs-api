const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { promisify } = require('util');

const config = require('../config');

const readFile = promisify(fs.readFile);

const CIPHER_ALGORITHM = 'aes-256-cbc';

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

module.exports = {
  loadKeyFile,
};
