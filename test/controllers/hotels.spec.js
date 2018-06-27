/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const wtJsLibs = require('../../src/services/wt-js-libs');
const {
  deployIndexAndHotel,
  deployFullHotel,
} = require('../utils/helpers');

describe('Hotels', function () {
  let server;
  let createWalletSpy;
  let wtLibsInstance;
  beforeEach(async () => {
    server = require('../../src/index');
    wtLibsInstance = wtJsLibs.getInstance();
    createWalletSpy = sinon.spy(wtLibsInstance, 'createWallet');
    await deployIndexAndHotel();
  });

  afterEach(() => {
    createWalletSpy.restore();
    server.close();
  });

  describe('GET /hotels', () => {
    beforeEach(async () => {
      await deployFullHotel(wtLibsInstance);
    });
    it('should return a list of hotels id', async () => {
      await request(server)
        .get('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { hotels } = res.body;
          expect(hotels.length).to.be.eql(2);

          hotels.forEach(hotel => {
            expect(hotel).to.have.property('id');
          });
        });
    });
    it('should return a list of hotels', async () => {
      const fields = [
        'manager',
        'id',
        'name',
        'description',
        'location',
        'contacts',
        'address',
        'roomTypes',
        'timezone',
        'currency',
        'images',
        'amenities',
        'updatedAt',
      ];
      const query = `fields=${fields.join()}`;

      await request(server)
        .get(`/hotels?${query}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { hotels } = res.body;
          expect(hotels.length).to.be.eql(2);
          hotels.forEach(hotel => {
            expect(hotel).to.have.property('id');
            expect(hotel).to.not.have.property('invalidField');
            expect(hotel).to.satisfy(
              hotel => {
                if (hotel.error) {
                  return true;
                }
                return (hotel.name && hotel.location);
              });
          });
        });
    });
  });

  describe('GET /hotels/:hotelAddress', () => {
    let address;
    beforeEach(async () => {
      address = await deployFullHotel(wtLibsInstance);
    });

    it('should return only required fields', async () => {
      const fields = ['name', 'location'];
      const query = `fields=${fields.join()}`;

      await request(server)
        .get(`/hotels/${address}?${query}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { hotel } = res.body;
          expect(hotel).to.have.all.keys([...fields, 'id']);
        })
        .expect(200);
    });

    it('should return only required fields', async () => {
      const fields = ['name', 'location'];
      const query = `fields=${fields.join()}`;

      await request(server)
        .get(`/hotels/${address}?${query}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { hotel } = res.body;
          expect(hotel).to.have.all.keys([...fields, 'id']);
        })
        .expect(200);
    });

    it('should return only required fields', async () => {
      const fields = ['manager'];
      const query = `fields=${fields.join()}`;

      await request(server)
        .get(`/hotels/${address}?${query}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { hotel } = res.body;
          expect(hotel).to.have.all.keys([...fields, 'id']);
        })
        .expect(200);
    });

    it('should return only id', async () => {
      await request(server)
        .get(`/hotels/${address}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { hotel } = res.body;
          expect(hotel).to.have.property('id');
        })
        .expect(200);
    });

    it('should return a 404 on a non-existent address', async () => {
      await request(server)
        .get('/hotels/0x994afd347b160be3973b41f0a144819496d175e9')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });
  });
});
