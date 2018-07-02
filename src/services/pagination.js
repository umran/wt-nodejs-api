const {
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGE_SIZE,
} = require('../constants.js');

const paginate = (items, limit = DEFAULT_PAGINATION_LIMIT, page = 0) => {
  let error, next;
  try {
    if (typeof limit !== 'number' || typeof page !== 'number'){
      throw new Error();
    }
    if (limit > MAX_PAGE_SIZE) {
      limit = MAX_PAGE_SIZE;
    };

    const start = page * limit;
    if (start > items.length) {
      throw new Error();
    };

    items = items.slice(start, start + limit);
    next = `limit=${limit}&page=${page + 1}`;
  } catch (e) {
    error = 'Problems with paging. Default values are used';
    items = items.slice(0, DEFAULT_PAGINATION_LIMIT);
    next = `limit=${DEFAULT_PAGINATION_LIMIT}&page=1`;
  }

  return { items, next, error };
};

module.exports = {
  paginate,
};
