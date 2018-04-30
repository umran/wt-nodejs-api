module.exports = {
  genericError: {
    status: 500,
    short: 'Something went wrong.',
    long: 'Something went wrong. Please contact the administrator.',
  },
  unreachableChain: {
    status: 500,
    short: 'Ethereum network seems unreachable.',
    long: 'Please contact the administrator.',
  },
  hotelNotFound: {
    status: 404,
    short: 'Hotel not found',
  },
  missingManager: {
    status: 400,
    short: 'Field `manager` is mandatory',
  },
  missingPassword: {
    status: 401,
    short: 'Password is required',
    long: 'You must include "X-Wallet-Password" header',
  },
  cannotUnlockWallet: {
    status: 401,
    short: 'Wallet cannot be unlocked',
  },
  managerWalletMismatch: {
    status: 401,
    short: 'Wallet owner and hotel manager differ.',
  },
  whiteList: {
    status: 403,
    short: 'IP is not whitelisted.',
    long: 'IP must be in the whitelist. Please contact the administrator.',
  },
};
