/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const { paginate, LimitValidationError,
  MissingStartWithError,
} = require('../../src/services/pagination');

const {
  DEFAULT_PAGE_SIZE,
} = require('../../src/constants');

describe('Pagination', function () {
  let allItems = [],
    basePath = '/hotels';
  beforeEach(() => {
    allItems = new Array(100).fill(0).map((a, i) => i);
  });

  describe('pagination behaviour', () => {
    it('should return default number of items if not said otherwise', async () => {
      const { items, next } = paginate(basePath, allItems);
      expect(items).to.be.an('array');
      expect(items.length).to.be.eql(DEFAULT_PAGE_SIZE);
      expect(items[0]).to.be.eql(0);
      expect(items[29]).to.be.eql(29);
      expect(next).to.be.eql(`http://example.com/hotels?limit=${DEFAULT_PAGE_SIZE}&startWith=30`);
    });

    it('should start where told to', async () => {
      const limit = 30;
      const { items, next } = paginate(basePath, allItems, limit, 35);
      expect(items).to.be.an('array');
      expect(items.length).to.be.eql(limit);
      expect(items[0]).to.be.eql(35);
      expect(items[29]).to.be.eql(64);
      expect(next).to.be.eql(`http://example.com/hotels?limit=${limit}&startWith=65`);
    });

    it('should return 1 item', async () => {
      const { items, next } = paginate(basePath, allItems, 1);
      expect(items).to.have.property('length', 1);
      expect(items[0]).to.be.equal(0);
      expect(next).to.be.eql('http://example.com/hotels?limit=1&startWith=1');
    });

    it('should not provide next if there are no more records', async () => {
      let { items, next } = paginate(basePath, allItems, 110);
      expect(items).to.have.property('length', 100);
      expect(next).to.be.undefined;
      const result = paginate(basePath, allItems, 100);
      expect(result.items).to.have.property('length', 100);
      expect(result.next).to.be.undefined;
    });

    it('should work with itemPaginationKey', async () => {
      let { items, next } = paginate(basePath, [{ a: 'a', b: 'b' }, { a: 'c', b: 'd' }], 1, null, 'b');
      expect(items).to.have.property('length', 1);
      expect(next).to.be.equal('http://example.com/hotels?limit=1&startWith=d');
    });

    it('should throw if selected startWith is not in items', async () => {
      expect(() => {
        paginate(basePath, allItems, 30, 'random0index');
      }).to.throw(MissingStartWithError, 'Cannot find startWith in items list.');
    });

    it('should throw if selected startWith is not in items with itemPaginationKey', async () => {
      expect(() => {
        paginate(basePath, [{ a: 'a', b: 'b' }, { a: 'c', b: 'd' }], 1, 'x', 'b');
      }).to.throw(MissingStartWithError, 'Cannot find startWith in items list.');
    });
  });

  describe('limit validation', () => {
    it('should throw if limit is not a number', async () => {
      const limit = 'zerp';
      expect(() => {
        paginate(basePath, allItems, limit);
      }).to.throw(LimitValidationError, 'Limit is not a number.');
    });

    it('should throw Limit out of range for a negative limit', async () => {
      const limit = -3;
      expect(() => {
        paginate(basePath, allItems, limit);
      }).to.throw(LimitValidationError, 'Limit is out of range.');
    });

    it('should throw Limit out of range for limit=0', async () => {
      const limit = 0;
      expect(() => {
        paginate(basePath, allItems, limit);
      }).to.throw(LimitValidationError, 'Limit is out of range.');
    });

    it('should throw Limit out of range for a limit bigger than MAX_PAGE_SIZE', async () => {
      const limit = 1500;
      expect(() => {
        paginate(basePath, allItems, limit);
      }).to.throw(LimitValidationError, 'Limit is out of range.');
    });

    it('should not panic when limit is passed as a string', async () => {
      const { items, next } = paginate(basePath, allItems, '7');
      expect(items).to.have.property('length', 7);
      expect(items[0]).to.be.equal(0);
      expect(items[6]).to.be.equal(6);
      expect(next).to.be.eql('http://example.com/hotels?limit=7&startWith=7');
    });
  });
});
