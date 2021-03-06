/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const fetch = require('node-fetch');
const config = require('../../../config.js');
const { AfterEach,
  BeforeEach,
  Before } = require('../../hooks.js');

describe('Hotels bookings', function () {
  AfterEach();
  BeforeEach();
  Before();
  describe('Confirm request', function () {
    it('POST /hotels/:hotelAddress/confirmation. Expect 200', async () => {
      const body = JSON.stringify({
        password: config.get('password'),
        required: true,
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/confirmation`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 200);
      response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      expect(response).to.have.property('status', 200);
      const { hotel } = await response.json();
      expect(hotel).to.have.property('waitConfirmation', true);
    });
    it('POST /hotels/:hotelAddress/confirmation. Expect 400 #missingPassword', async () => {
      const body = JSON.stringify({
        required: '123',
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/confirmation`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 400);
      const res = await response.json();
      expect(res).to.have.property('code', '#missingPassword');
    });
    it('POST /hotels/:hotelAddress/confirmation. Expect 400 #missingRequired', async () => {
      const body = JSON.stringify({
        password: config.get('password'),
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/confirmation`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 400);
      const res = await response.json();
      expect(res).to.have.property('code', '#missingRequired');
    });
  });
  describe('Get Hotel request and bookings', function () {
    it('GET /hotels/:hotelAdress/bookings. Expect 200', async () => {
      const body = JSON.stringify({
        block: 1,
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/bookings`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });

      expect(response).to.have.property('status', 200);
      const { bookings } = await response.json();
      expect(bookings).to.be.an('array');
    });
    it('GET /hotels/:hotelAdress/requests. Expect 200', async () => {
      let body = JSON.stringify({
        password: config.get('password'),
        required: true,
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/confirmation`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 200);

      response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      expect(response).to.have.property('status', 200);
      const { hotel } = await response.json();
      expect(hotel).to.have.property('waitConfirmation', true);

      const guestData = '0123456789ABCDEF';
      const daysAmount = 1;
      const fromDate = new Date('10/10/2020');

      body = JSON.stringify({
        account: config.get('user'),
        guest: guestData,
        days: daysAmount,
        from: fromDate,
      });

      response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAddress')}/book`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.have.property('status', 200);

      body = JSON.stringify({
        block: 1,
      });

      response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/requests`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });
      expect(response).to.have.property('status', 200);

      const { requests } = await response.json();
      expect(requests).to.be.an('array');
      expect(requests[0]).to.have.property('guestData', guestData);
      expect(requests[0]).to.have.property('daysAmount', daysAmount.toString());
      expect(Date.parse(requests[0].fromDate)).to.eql(Date.parse(fromDate));
      expect(requests[0]).to.have.property('unit', config.get('unitAddress'));
      expect(requests[0]).to.have.property('from', config.get('user'));
      expect(requests[0]).to.have.property('id');
    });
    it('GET /hotels/:hotelAdress/requests from creation block. Expect 200', async () => {
      let body = JSON.stringify({
        password: config.get('password'),
        required: true,
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/confirmation`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 200);
      response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      expect(response).to.have.property('status', 200);
      const { hotel } = await response.json();
      expect(hotel).to.have.property('waitConfirmation', true);

      const guestData = '0123456789ABCDEF';
      const daysAmount = 1;
      const fromDate = new Date('10/10/2020');

      body = JSON.stringify({
        account: config.get('user'),
        guest: guestData,
        days: daysAmount,
        from: fromDate,
      });
      response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAddress')}/book`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.have.property('status', 200);
      response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/requests`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      expect(response).to.have.property('status', 200);
      const { requests } = await response.json();
      expect(requests).to.be.an('array');
      expect(requests[0]).to.have.property('guestData', guestData);
      expect(requests[0]).to.have.property('daysAmount', daysAmount.toString());
      expect(Date.parse(requests[0].fromDate)).to.eql(Date.parse(fromDate));
      expect(requests[0]).to.have.property('unit', config.get('unitAddress'));
      expect(requests[0]).to.have.property('from', config.get('user'));
      expect(requests[0]).to.have.property('id');
    });
  });
});
