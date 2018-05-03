const _ = require('lodash');
const { WALLET_PASSWORD_HEADER } = require('../constants');
const { storeKeyFile, loadKeyFile, removeKeyFile } = require('../services/keyfiles');
const { handleApplicationError } = require('../errors');

const REQUIRED_VERSION = 3;

// Format taken from https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
function hasAllPbkdf2Sha256Fields (keyStore) {
  return !(!keyStore.address ||
      !keyStore.id ||
      !keyStore.version ||
      !keyStore.crypto ||
      !keyStore.crypto.mac ||
      !keyStore.crypto.ciphertext ||
      !keyStore.crypto.cipherparams ||
      !keyStore.crypto.cipherparams.iv ||
      !keyStore.crypto.cipher ||
      !keyStore.crypto.kdf ||
      !keyStore.crypto.kdfparams ||
      !keyStore.crypto.kdfparams.dklen ||
      !keyStore.crypto.kdfparams.salt ||
      !keyStore.crypto.kdfparams.c ||
      !keyStore.crypto.kdfparams.prf
  );
}

// Format taken from https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
function hasAllScryptFields (keyStore) {
  return !(!keyStore.address ||
      !keyStore.id ||
      !keyStore.version ||
      !keyStore.crypto ||
      !keyStore.crypto.mac ||
      !keyStore.crypto.ciphertext ||
      !keyStore.crypto.cipherparams ||
      !keyStore.crypto.cipherparams.iv ||
      !keyStore.crypto.cipher ||
      !keyStore.crypto.kdf ||
      !keyStore.crypto.kdfparams ||
      !keyStore.crypto.kdfparams.dklen ||
      !keyStore.crypto.kdfparams.salt ||
      !keyStore.crypto.kdfparams.n ||
      !keyStore.crypto.kdfparams.r ||
      !keyStore.crypto.kdfparams.p
  );
}

const create = async (req, res, next) => {
  const password = req.header(WALLET_PASSWORD_HEADER);
  const keyStore = req.body;
  if (!password) {
    return next(handleApplicationError('missingPassword'));
  }
  if (!keyStore.id) {
    return next(handleApplicationError('missingWallet'));
  }
  if (!keyStore.version || parseInt(keyStore.version, 10) !== REQUIRED_VERSION) {
    return next(handleApplicationError('badWalletVersion'));
  }

  if (!hasAllPbkdf2Sha256Fields(keyStore) && !hasAllScryptFields(keyStore)) {
    return next(handleApplicationError('badWalletFormat'));
  }
  // Check for possible overwrites
  try {
    const existingWallet = await loadKeyFile(keyStore.id);
    if (!_.isEqual(existingWallet, keyStore)) {
      return next(handleApplicationError('walletConflict'));
    }
  } catch (e) {
    // pass as it does not matter that it does not exist
  }

  try {
    const wallet = await res.locals.wt.instance.createWallet(keyStore);
    await wallet.unlock(password);
    wallet.destroy();
    await storeKeyFile(keyStore);
    res.status(200).json({
      id: keyStore.id,
    });
  } catch (err) {
    if (err.message.match(/key derivation failed/i)) {
      return next(handleApplicationError('cannotUnlockWallet', err));
    }
    return next(handleApplicationError('wallet', err));
  }
};

const remove = async (req, res, next) => {
  const password = req.header(WALLET_PASSWORD_HEADER);
  const { walletId } = req.params;
  try {
    const keyStore = await loadKeyFile(walletId);
    const wallet = await res.locals.wt.instance.createWallet(keyStore);
    await wallet.unlock(password);
    wallet.destroy();
    await removeKeyFile(walletId);
    return res.sendStatus(204);
  } catch (err) {
    if (err.message.match(/wallet not found/i)) {
      return next(handleApplicationError('walletNotFound'), err);
    }
    if (err.message.match(/no password given/i)) {
      return next(handleApplicationError('missingPassword'), err);
    }
    if (err.message.match(/key derivation failed/i)) {
      return next(handleApplicationError('cannotUnlockWallet', err));
    }
    return next(handleApplicationError('wallet', err));
  }
};

const get = async (req, res, next) => {
  const password = req.header(WALLET_PASSWORD_HEADER);
  const { walletId } = req.params;
  try {
    const keyStore = await loadKeyFile(walletId);
    const wallet = await res.locals.wt.instance.createWallet(keyStore);
    await wallet.unlock(password);
    wallet.destroy();
    return res.sendStatus(200);
  } catch (err) {
    if (err.message.match(/wallet not found/i)) {
      return next(handleApplicationError('walletNotFound'), err);
    }
    if (err.message.match(/no password given/i)) {
      return next(handleApplicationError('missingPassword'), err);
    }
    if (err.message.match(/key derivation failed/i)) {
      return next(handleApplicationError('cannotUnlockWallet', err));
    }
    return next(handleApplicationError('wallet', err));
  }
};

module.exports = {
  create,
  remove,
  get,
};
