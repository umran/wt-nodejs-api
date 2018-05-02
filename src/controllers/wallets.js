const { PASSWORD_HEADER } = require('../constants');
const { storeKeyFile, loadKeyfile, removeKeyfile } = require('../helpers/keyfiles');
const { handleApplicationError } = require('../errors');
const config = require('../config');

const create = async (req, res, next) => {
  const password = req.header(PASSWORD_HEADER);
  const { keyStoreV3 } = req.body;
  if (!password) {
    return next(handleApplicationError('missingPassword', new Error()));
  }
  if (!keyStoreV3) {
    return next(handleApplicationError('missingWallet', new Error()));
  }
  try {
    console.log('keyStoreV3', keyStoreV3);
    const wallet = await req.wt.instance.createWallet(keyStoreV3);
    await wallet.unlock(password);
    wallet.destroy();
    storeKeyFile(keyStoreV3, config.get('privateKeyFile'));
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return next(handleApplicationError('wallet', err));
  }
};

const read = async (req, res, next) => {
  try {
    const keyStoreV3 = await loadKeyfile(config.get('privateKeyFile'));
    return res.status(200).json({ keyStoreV3 });
  } catch (err) {
    return next(handleApplicationError('wallet', err));
  }
};

const remove = async (req, res, next) => {
  try {
    const keyStoreV3 = await loadKeyfile(config.get('privateKeyFile'));
    removeKeyfile(config.get('privateKeyFile'));
    return res.status(200).json({ keyStoreV3 });
  } catch (err) {
    return next(handleApplicationError('wallet', err));
  }
};

module.exports = {
  create,
  read,
  remove,
};
