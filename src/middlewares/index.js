const compose = require('compose-middleware').compose;

const wtJsLibs = require('../services/wt-js-libs');
const { PASSWORD_HEADER } = require('../constants');
const { loadKeyfile } = require('../helpers/keyfiles');
const { handleApplicationError } = require('../errors');
const config = require('../config');

const injectWtLibs = async (req, res, next) => {
  if (req.wt) {
    next();
  }
  const wtLibsInstance = wtJsLibs.getInstance();
  req.wt = {
    instance: wtLibsInstance,
    index: await wtLibsInstance.getWTIndex(config.get('indexAddress')),
    wallet: null,
  };
  next();
};

const unlockAccount = compose([
  injectWtLibs,
  async (req, res, next) => {
    const password = req.header(PASSWORD_HEADER);
    if (!password) {
      return next(handleApplicationError('missingPassword'));
    }

    // TODO handle file read error
    const wallet = await loadKeyfile(config.get('privateKeyFile'));
    try {
      req.wt.wallet = await req.wt.instance.createWallet(await wallet);
      await req.wt.wallet.unlock(password);
    } catch (err) {
      return next(handleApplicationError('cannotUnlockWallet', err));
    }
    next();
  },
]);

const validateIPWhiteList = function (req, res, next) {
  const whiteList = config.get('whiteList');
  if (!whiteList.length) {
    return next();
  }
  let ip = req.ip ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }
  if (whiteList.indexOf(ip) === -1) {
    return next(handleApplicationError('whiteList', new Error()));
  }
  next();
};

module.exports = {
  injectWtLibs,
  unlockAccount,
  validateIPWhiteList,
};
