const { WALLET_PASSWORD_HEADER, WALLET_ID_HEADER } = require('../constants');
const { storeKeyFile, loadKeyFile, removeKeyFile } = require('../helpers/keyfiles');
const { handleApplicationError } = require('../errors');
const config = require('../config');

const create = async (req, res, next) => {
  const password = req.header(WALLET_PASSWORD_HEADER);
  const { keyStoreV3 } = req.body;
  if (!password) {
    return next(handleApplicationError('missingPassword', new Error()));
  }
  if (!keyStoreV3) {
    return next(handleApplicationError('missingWallet', new Error()));
  }
  // TODO check duplicates
  // TODO check required storage version
  try {
    console.log('keyStoreV3', keyStoreV3);
    const wallet = await res.locals.wt.instance.createWallet(keyStoreV3);
    // TODO report on mismatching password
    await wallet.unlock(password);
    wallet.destroy();
    storeKeyFile(keyStoreV3);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return next(handleApplicationError('wallet', err));
  }
};

const remove = async (req, res, next) => {
  const password = req.header(WALLET_PASSWORD_HEADER);
  const uuid = req.header(WALLET_ID_HEADER);
  try {
    const keyStoreV3 = await loadKeyFile(uuid);
    // TODO try to make wallet and unlock
    removeKeyFile(uuid);
    return res.status(200).json({ keyStoreV3 });
  } catch (err) {
    return next(handleApplicationError('wallet', err));
  }
};

module.exports = {
  create,
  remove,
};
