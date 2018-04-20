const { handle } = require('../errors');
const config = require('../config');
const PASSWORD_HEADER = 'X-Wallet-Password';

function validateWhiteList (req, res, next) {
  const whiteList = config.get('whiteList');
  if (!whiteList.length) return next();
  let ip = req.ip ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

  if (ip.substr(0, 7) === '::ffff:') ip = ip.substr(7);
  if (whiteList.indexOf(ip) === -1) return next(handle('whiteList', new Error()));

  next();
}

function validatePassword (req, res, next) {
  const password = req.header(PASSWORD_HEADER);
  if (!password) return next(handle('missingPassword', new Error()));
  next();
}

module.exports = {
  validatePassword,
  validateWhiteList,
  PASSWORD_HEADER,
};
