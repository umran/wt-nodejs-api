module.exports = {
  unknownError: {
    status: 500,
    short: 'Something went wrong.',
    long: 'Something went wrong. Please contact the administrator.',
  },
  missingPassword: {
    status: 401,
    short: 'Password is required',
    long: 'You must include "X-Wallet-Password" header',
  },
  whiteList: {
    status: 403,
    short: 'IP is not whitelisted.',
    long: 'IP must be in the whitelist. Please contact the administrator.',
  },
};
