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
  missingWallet: {
    status: 401,
    short: 'Wallet id is required',
    long: 'You must include "X-Wallet-Id" header',
  },
  badWalletVersion: {
    status: 400,
    short: 'Wallet version is not 3',
    long: 'Platform supports only Wallets in version 3',
  },
  badWalletFormat: {
    status: 400,
    short: 'Wallet has a bad format',
    long: 'Check https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition for valid formats',
  },
  walletConflict: {
    status: 400,
    short: 'Wallet ID already exists',
    long: 'Wallet ID already exists but with a different contents. If you\'ve changed the password, delete the original wallet.',
  },
  walletNotFound: {
    status: 404,
    short: 'Wallet not found',
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
  rateLimit: {
    status: 429,
    short: 'API rate Limit Exceeded',
    long: 'The rate limit was exceeded. Please try later.',
  },
};
