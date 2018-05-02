const { WALLET_PASSWORD_HEADER } = require('../constants');
const { storeKeyFile, loadKeyfile, removeKeyfile } = require('../helpers/keyfiles');
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
  // TODO store under ${keyStoreV3.id}.json as per https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
  try {
    console.log('keyStoreV3', keyStoreV3);
    const wallet = await res.locals.wt.instance.createWallet(keyStoreV3);
    // TODO report on mismatching password
    await wallet.unlock(password);
    wallet.destroy();
    storeKeyFile(keyStoreV3, config.get('privateKeyFile'));
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
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
  remove,
};
