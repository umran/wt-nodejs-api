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
  hotelChecksum: {
    status: 422,
    short: 'Checksum failed for hotel address.',
    long: 'Given hotel address is not a valid Ethereum address. Must be a valid checksum address.',
  },
  limitRange: {
    status: 422,
    short: 'Limit must be a natural number.',
    long: 'Limit must be greater than 0.',
  },
  paginationLimit: {
    status: 422,
    short: 'The page exceed the number of hotels.',
    long: 'The first item of the page is beyond the amount of hotels.',
  },
  paginationFormat: {
    status: 422,
    short: 'Page and limit must be numbers.',
    long: 'Limit must be a natural number. Page must be greater than 0s.',
  },
  negativePage: {
    status: 422,
    short: 'Page must be great than or equal to zero.',
    long: 'Limit must be a natural number. Page must be greater than 0s.',
  },
  roomTypeNotFound: {
    status: 404,
    short: 'Room type not found',
  },
};
