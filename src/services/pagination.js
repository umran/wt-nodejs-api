const {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} = require('../constants');

const paginate = (items, limit = DEFAULT_PAGE_SIZE, page = 0) => {
  limit = parseInt(limit);
  page = parseInt(page);
  if (isNaN(limit) || isNaN(page)) {
    throw new Error('Limit and page are not numbers.');
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
  const total = items.length;
  let next;
  items = items.slice(start, start + limit);
  if (start + limit < total) {
    next = `limit=${limit}&page=${page + 1}`;
  }
  return { items, next };
};

module.exports = {
  paginate,
};
