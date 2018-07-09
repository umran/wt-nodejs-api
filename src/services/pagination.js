const {
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGE_SIZE,
} = require('../constants.js');

const paginate = (items, limit = DEFAULT_PAGINATION_LIMIT, page = 0) => {
  limit = parseInt(limit);
  page = parseInt(page);
  if (isNaN(limit) || isNaN(page)) {
    throw new Error('limit and page are not numbers.');
  }
  if (limit > MAX_PAGE_SIZE || limit <= 0) {
    throw new Error('Limit out of range.');
  }
  if (page < 0) {
    throw new Error('Negative Page.');
  }

  const start = page * limit;
  if (start > items.length) {
    throw new Error('Pagination outside of the limits.');
  }
  items = items.slice(start, start + limit);
  const next = `limit=${limit}&page=${page + 1}`;

  return { items, next };
};

module.exports = {
  paginate,
};
