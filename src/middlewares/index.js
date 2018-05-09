const compose = require('compose-middleware').compose;

const wtJsLibs = require('../services/wt-js-libs');
const { WALLET_PASSWORD_HEADER, WALLET_ID_HEADER } = require('../constants');
const { loadKeyFile } = require('../services/keyfiles');
const { handleApplicationError } = require('../errors');
const config = require('../config');

const injectWtLibs = async (req, res, next) => {
  if (res.locals.wt) {
    next();
  }
  const wtLibsInstance = wtJsLibs.getInstance();
  res.locals.wt = {
    instance: wtLibsInstance,
    index: await wtLibsInstance.getWTIndex(config.get('indexAddress')),
    wallet: null,
  };
  next();
};

const unlockAccount = compose([
  injectWtLibs,
  async (req, res, next) => {
    const keyFileUuid = req.header(WALLET_ID_HEADER);
    const password = req.header(WALLET_PASSWORD_HEADER);
    if (!password) {
      return next(handleApplicationError('missingPassword'));
    }
    if (!keyFileUuid) {
      return next(handleApplicationError('missingWallet'));
    }

    try {
      const wallet = await loadKeyFile(keyFileUuid);
      res.locals.wt.wallet = await res.locals.wt.instance.createWallet(await wallet);
      await res.locals.wt.wallet.unlock(password);
    } catch (err) {
      return next(handleApplicationError('cannotUnlockWallet', err));
    }
    next();
  },
]);

const wipeAccountFromMemory = async (req, res, next) => {
  res.on('finish', () => {
    if (res.locals.wt.wallet) {
      res.locals.wt.wallet.destroy();
    }
  });
  next();
};

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
  wipeAccountFromMemory,
  validateIPWhiteList,
};
