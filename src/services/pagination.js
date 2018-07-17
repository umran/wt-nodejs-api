const { baseUrl } = require('../config');
const {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} = require('../constants');

class LimitValidationError extends Error {};
class MissingStartWithError extends Error {};

const paginate = (basePath, items, limit = DEFAULT_PAGE_SIZE, startWith, itemPaginationKey) => {
  limit = parseInt(limit);
  if (isNaN(limit)) {
    throw new LimitValidationError('Limit is not a number.');
  }
  if (limit > MAX_PAGE_SIZE || limit <= 0) {
    throw new LimitValidationError('Limit is out of range.');
  }
  if (startWith && itemPaginationKey) {
    startWith = items.find((i) => i[itemPaginationKey] === startWith);
    if (!startWith) {
      throw new MissingStartWithError('Cannot find startWith in items list.');
    }
  }

  let startWithIndex = items.indexOf(startWith);
  if (startWith && startWithIndex === -1) {
    throw new MissingStartWithError('Cannot find startWith in items list.');
  } else if (!startWith) {
    startWithIndex = 0;
  }

  let next;
  if (startWithIndex + limit < items.length) {
    let nextStart = items[startWithIndex + limit];
    if (itemPaginationKey) {
      nextStart = nextStart[itemPaginationKey];
    }
    next = `${baseUrl}${basePath}?limit=${limit}&startWith=${nextStart}`;
  }
  
  return {
    items: items.slice(startWithIndex, startWithIndex + limit),
    next,
  };
};

module.exports = {
  paginate,
  LimitValidationError,
  MissingStartWithError,
};
