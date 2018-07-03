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
      const { items, next } = paginate(allItems);
      expect(items).to.be.an('array');
      expect(items.length).to.be.eql(DEFAULT_PAGINATION_LIMIT);
      expect(items[0]).to.be.eql(0);
      expect(items[29]).to.be.eql(29);
      expect(next).to.be.eql(`limit=${DEFAULT_PAGINATION_LIMIT}&page=1`);
    });
    it('should return  30-59 items', async () => {
      const page = 1;
      const limit = 30;
      const { items, next } = paginate(allItems, limit, page);
      expect(items).to.be.an('array');
      expect(items.length).to.be.eql(limit);
      expect(items[0]).to.be.eql(30);
      expect(items[29]).to.be.eql(59);
      expect(next).to.be.eql(`limit=${limit}&page=${page + 1}`);
    });
    it('should throw Pagination outside of the limits.', async () => {
      const page = 130;
      const limit = 15;
      try {
        paginate(allItems, limit, page);
      } catch (e) {
        expect(e).to.have.property('message', 'Pagination outside of the limits.');
      }
    });
    it('should throw limit and page are not numbers.', async () => {
      const page = 'zero';
      const limit = 15;
      try {
        paginate(allItems, limit, page);
      } catch (e) {
        expect(e).to.have.property('message', 'limit and page are not numbers.');
      }
    });
    it('should throw Limit out of range.', async () => {
      const page = 0;
      const limit = -1;
      try {
        paginate(allItems, limit, page);
      } catch (e) {
        expect(e).to.have.property('message', 'Limit out of range.');
      }
    });
    it('should throw Limit out of range.', async () => {
      const page = 0;
      const limit = 0;
      try {
        paginate(allItems, limit, page);
      } catch (e) {
        expect(e).to.have.property('message', 'Limit out of range.');
      }
    });
    it('should throw Limit out of range.', async () => {
      const page = 0;
      const limit = 1500;
      try {
        paginate(allItems, limit, page);
      } catch (e) {
        expect(e).to.have.property('message', 'Limit out of range.');
      }
    });
    it('should return 1 item', async () => {
      const { items, next } = paginate(allItems, 1);
      expect(items).to.have.property('length', 1);
      expect(next).to.be.eql('limit=1&page=1');
    });
  });
});
