const RateLimit = require('express-rate-limit');
const { handleApplicationError } = require('../errors');

const handler = (req, res, next) => {
  next(handleApplicationError('rateLimit'));
};

const throttling = new RateLimit({
  windowMs: 60000, // 1 min
  delayAfter: 1,
  delayMs: 3000,
  max: 2,
  handler,
});

module.exports = {
  throttling,
};
