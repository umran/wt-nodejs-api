/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const wtJsLibs = require('../../src/services/wt-js-libs');
const config = require('../../src/config');
const { WALLET_PASSWORD_HEADER, WALLET_ID_HEADER } = require('../../src/constants');
const {
  deployIndexAndHotel,
  deployFullHotel,
} = require('../utils/helpers');

// We can use the default test location for wallets since we're not modifying them
const walletUuid = 'ffa1e3be-e80a-4e1c-bb71-ed54c3bef115';
const walletPassword = 'test123';

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
      const fields = ['name', 'location', 'invalidField'];
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

  xdescribe('POST /hotels', () => {
    const name = 'new hotel';
    const description = 'some description';
    const manager = '0xd39ca7d186a37bb6bf48ae8abfeb4c687dc8f906';
    const location = {
      latitude: 50.0754789,
      longitude: 14.4225864,
    };

    it('should create transactions on chain that will create a hotel', async () => {
      await request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ hotel: { name, description, manager, location } })
        .expect((res) => {
          expect(res.body).to.have.property('address');
          expect(res.body).to.have.property('transactionIds');
          expect(res.body.transactionIds.length).to.be.above(0);
        })
        .expect(202);
      expect(createWalletSpy.callCount).to.be.eql(1);
      const wallet = await createWalletSpy.returnValues[0];
      expect(wallet).to.have.property('__destroyedFlag', true);
    });

    it('should return 400 on missing manager', async () => {
      const res = await request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ hotel: { name, description, location } })
        .expect(400);

      expect(res.body).to.have.property('code', '#missingManager');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/is mandatory/i);
    });

    it('should return 401 on bad password', async () => {
      const res = await request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, 'random-password')
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ hotel: { name, description, manager, location } })
        .expect(401);
      expect(res.body).to.have.property('code', '#cannotUnlockWallet');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/cannot be unlocked/i);
    });

    it('should return 401 on bad wallet id', async () => {
      const res = await request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .set(WALLET_ID_HEADER, 'random-nonexistent-wallet-id')
        .send({ hotel: { name, description, manager, location } })
        .expect(401);
      expect(res.body).to.have.property('code', '#cannotUnlockWallet');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/cannot be unlocked/i);
    });

    it('should return 401 on missing password', async () => {
      const res = await request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ hotel: { name, description, manager } })
        .expect(401);
      expect(res.body).to.have.property('code', '#missingPassword');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/password is required/i);
    });

    it('should return 401 on missing wallet', async () => {
      const res = await request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .send({ hotel: { name, description, manager, location } })
        .expect(401);
      expect(res.body).to.have.property('code', '#missingWallet');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/wallet id is required/i);
    });
  });

  xdescribe('PUT /hotels/:hotelAddress', () => {
    const name = 'new hotel';
    const description = 'some description';
    const manager = '0xd39ca7d186a37bb6bf48ae8abfeb4c687dc8f906';
    const url = 'ipfs://some-new-shiny-url';
    const location = {
      latitude: 50.0754789,
      longitude: 14.4225864,
    };

    it('should create transactions on chain that will update a hotel', async () => {
      let address;
      let res = await request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ hotel: { name, description, manager, location } });
      address = res.body.address;
      expect(res.body).to.have.property('address');
      expect(res.body).to.have.property('transactionIds');
      expect(res.body.transactionIds.length).to.be.above(0);
      expect(createWalletSpy.callCount).to.be.eql(1);
      let wallet = await createWalletSpy.returnValues[0];
      expect(wallet).to.have.property('__destroyedFlag', true);
      createWalletSpy.resetHistory();

      await request(server)
        .put(`/hotels/${res.body.address}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ hotel: { description: 'Best hotel.', name: 'WTHotel', url: 'new-url' } })
        .expect((res) => {
          expect(res.body.transactionIds.length).to.be.above(0);
        })
        .expect(202);

      expect(createWalletSpy.callCount).to.be.eql(1);
      wallet = await createWalletSpy.returnValues[0];
      expect(wallet).to.have.property('__destroyedFlag', true);

      res = await request(server)
        .get(`/hotels/${address}`)
        .expect(200);
      expect(res.body).to.have.nested.property('hotel.url', 'new-url');
      expect(res.body).to.have.nested.property('hotel.name', 'WTHotel');
      expect(res.body).to.have.nested.property('hotel.description', 'Best hotel.');
    });

    it('should never update a manager', async () => {
      await request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ hotel: {
          name,
          description,
          location,
          manager: 'someone-else',
        } })
        .expect(202);

      const res = await request(server)
        .get(`/hotels/${config.get('testAddress')}`)
        .expect(200);
      expect(res.body).to.have.nested.property('hotel.manager');
      expect(res.body.hotel.manager.toLowerCase()).to.be.eql(manager);
    });

    it('should never null url', async () => {
      await request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ hotel: { url: null } })
        .expect(202);

      const res = await request(server)
        .get(`/hotels/${config.get('testAddress')}`)
        .expect(200);
      expect(res.body).to.have.nested.property('hotel.url');
    });

    it('should return 404 when trying to update non-existing hotel', async () => {
      await request(server)
        .put('/hotels/0x76ccdbb28c18168cc4ab55b11fc3be776e81200c')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ name, description, location })
        .expect(404);
    });

    it('should return 401 on updating a hotel of a different manager', async () => {
      await request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, 'windingtree')
        .set(WALLET_ID_HEADER, '7fe84016-4686-4622-97c9-dc7b47f5f5c6')
        // url is required to force interaction with network
        .send({ hotel: { name, description: 'random-updated-description', location, url } })
        .expect(401);
    });

    it('should return 401 on bad password', async () => {
      const res = await request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, 'random-password')
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ hotel: { name, description, manager, location } })
        .expect(401);
      expect(res.body).to.have.property('code', '#cannotUnlockWallet');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/cannot be unlocked/i);
    });

    it('should return 401 on a missing password', async () => {
      const res = await request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_ID_HEADER, walletUuid)
        .send({ hotel: { name, description, manager, location } })
        .expect(401);
      expect(res.body).to.have.property('code', '#missingPassword');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/password is required/i);
    });

    it('should return 401 on a missing wallet id', async () => {
      const res = await request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .send({ hotel: { name, description, manager, location } })
        .expect(401);
      expect(res.body).to.have.property('code', '#missingWallet');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/wallet id is required/i);
    });
  });

  xdescribe('DELETE /hotels/:hotelAddress', () => {
    it('should create transactions on chain that will delete a hotel', async () => {
      const res = await request(server)
        .delete(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .set(WALLET_ID_HEADER, walletUuid)
        .expect(202);

      expect(createWalletSpy.callCount).to.be.eql(1);
      expect(res.body.transactionIds.length).to.be.above(0);
      const wallet = await createWalletSpy.returnValues[0];
      expect(wallet).to.have.property('__destroyedFlag', true);
    });

    it('should return 404 when trying to delete non-existing hotel', async () => {
      await request(server)
        .delete('/hotels/0x76ccdbb28c18168cc4ab55b11fc3be776e81200c')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .set(WALLET_ID_HEADER, walletUuid)
        .expect(404);
    });

    it('should return 401 on deleting a hotel of a different manager', async () => {
      await request(server)
        .delete(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, 'windingtree')
        .set(WALLET_ID_HEADER, '7fe84016-4686-4622-97c9-dc7b47f5f5c6')
        .expect(401);
    });

    it('should return 401 on bad password', async () => {
      const res = await request(server)
        .delete(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, 'random-password')
        .set(WALLET_ID_HEADER, walletUuid)
        .expect(401);
      expect(res.body).to.have.property('code', '#cannotUnlockWallet');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/cannot be unlocked/i);
    });

    it('should return 401 on a missing password', async () => {
      const res = await request(server)
        .delete(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_ID_HEADER, walletUuid);
      expect(res.body).to.have.property('code', '#missingPassword');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/password is required/i);
    });

    it('should return 401 on a missing wallet id', async () => {
      const res = await request(server)
        .delete(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword);
      expect(res.body).to.have.property('code', '#missingWallet');
      expect(res.body).to.have.property('short');
      expect(res.body.short).to.match(/wallet id is required/i);
    });
  });
});
