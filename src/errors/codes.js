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
