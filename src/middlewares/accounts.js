const wtJsLibs = require('../services/wt-js-libs');
const { PASSWORD_HEADER } = require('../helpers/validators');
const { loadAccount } = require('../helpers/crypto');
const config = require('../config');
const { handle } = require('../errors');

const accountLoader = async (req, res, next) => {
  const password = req.header(PASSWORD_HEADER);
  const wallet = loadAccount(config.get('privateKeyFile'));

  const wtLibsInstance = wtJsLibs.getInstance();
  try {
    const wtWallet = await wtLibsInstance.createWallet(wallet);
    await wtWallet.unlock(password);
    req.wtWallet = wtWallet;
  } catch (err) {
    return next(handle('wallet', err));
  }
  next();
};

module.exports = {
  accountLoader,
};
