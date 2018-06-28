/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const request = require('supertest');
const wtJsLibs = require('../../src/services/wt-js-libs');
const {
  deployIndex,
  deployFullHotel,
} = require('../utils/helpers');

describe('Hotels', function () {
  let server;
  let wtLibsInstance;
  beforeEach(async () => {
    server = require('../../src/index');
    wtLibsInstance = wtJsLibs.getInstance();
    await deployIndex();
  });

  afterEach(() => {
    server.close();
  });

  describe('GET /hotels', () => {
    beforeEach(async () => {
      await deployFullHotel(wtLibsInstance);
      await deployFullHotel(wtLibsInstance);
    });
    it('should return default fields for hotels', async () => {
      await request(server)
        .get('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { items } = res.body;
          expect(items.length).to.be.eql(2);

          items.forEach(hotel => {
            expect(hotel).to.have.property('id');
          });
        });
    });
    it('should return only required fields', async () => {
      const fields = [
        'managerAddress',
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
          const { items } = res.body;
          expect(items.length).to.be.eql(2);
          items.forEach(hotel => {
            expect(hotel).to.have.all.keys(fields);
          });
        });
    });
  });

  describe('GET /hotels/:hotelAddress', () => {
    let address;
    beforeEach(async () => {
      address = await deployFullHotel(wtLibsInstance);
    });

    it('should return default fields', async () => {
      const defaultHotelFields = [
        'id',
        'location',
        'name',
        'description',
        'contacts',
        'address',
        'currency',
        'images',
        'amenities',
        'updatedAt',
      ];
      await request(server)
        .get(`/hotels/${address}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { hotel } = res.body;
          expect(hotel).to.have.all.keys(defaultHotelFields);
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
      const fields = ['managerAddress'];
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
      const fields = ['managerAddress', 'name'];
      const invalidFields = ['invalid', 'invalidField'];
      const query = `fields=${fields.join()},${invalidFields.join()}`;

      await request(server)
        .get(`/hotels/${address}?${query}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { hotel } = res.body;
          expect(hotel).to.have.all.keys([...fields, 'id']);
          expect(hotel).to.not.have.all.keys(invalidFields);
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
