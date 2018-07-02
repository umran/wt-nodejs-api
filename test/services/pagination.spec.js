/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const { paginate } = require('../../src/services/pagination.js');

const {
  DEFAULT_PAGINATION_LIMIT,
} = require('../../src/constants.js');

describe('Pagination', function () {
  let allItems = [];
  beforeEach(() => {
    allItems = new Array(100).fill(0).map((a, i) => i);
  });

  describe('Paginate items', () => {
    it('should return first 30 items', async () => {
      const { items, next, error } = paginate(allItems);
      expect(items).to.be.an('array');
      expect(items.length).to.be.eql(DEFAULT_PAGINATION_LIMIT);
      expect(items[0]).to.be.eql(0);
      expect(items[29]).to.be.eql(29);
      expect(next).to.be.eql(`limit=${DEFAULT_PAGINATION_LIMIT}&page=1`);
      expect(error).to.not.be.ok;
    });
    it('should return  30-59 items', async () => {
      const page = 1;
      const limit = 30;
      const { items, next, error } = paginate(allItems, limit, page);
      expect(items).to.be.an('array');
      expect(items.length).to.be.eql(limit);
      expect(items[0]).to.be.eql(30);
      expect(items[29]).to.be.eql(59);
      expect(next).to.be.eql(`limit=${limit}&page=${page + 1}`);
      expect(error).to.not.be.ok;
    });
    it('should return first items and throw', async () => {
      const page = 13;
      const limit = 3055;
      const { items, next, error } = paginate(allItems, limit, page);
      expect(items).to.be.an('array');
      expect(items.length).to.be.eql(DEFAULT_PAGINATION_LIMIT);
      expect(items[0]).to.be.eql(0);
      expect(items[29]).to.be.eql(29);
      expect(next).to.be.eql(`limit=${DEFAULT_PAGINATION_LIMIT}&page=1`);
      expect(error).to.be.ok;
    });

    it('should return empty and throw', async () => {
      const page = 13;
      const limit = 3055;
      const { items, next, error } = paginate([], limit, page);
      expect(items).to.be.an('array');
      expect(items.length).to.be.eql(0);
      expect(next).to.be.eql(`limit=${DEFAULT_PAGINATION_LIMIT}&page=1`);
      expect(error).to.be.ok;
    });
  });
});
