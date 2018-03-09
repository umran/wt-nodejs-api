/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const fetch = require('node-fetch');
const config = require('../../../config.js');
const { AfterEach,
  BeforeEach,
  Before } = require('../../hooks.js');

describe('Units prices', function () {
  AfterEach();
  BeforeEach();
  Before();
  const defaultPrice = 78;
  const defaultLifPrice = 2;
  describe('Units Líf prices', function () {
    it('GET /units/:unitAddress/lifCosts. Expect 200', async () => {
      const days = 5;
      const estimatedCost = defaultLifPrice * days;
      const body = JSON.stringify({
        password: config.get('password'),
        days,
        from: new Date('10/10/2020'),
      });
      let response = await fetch(`http://localhost:3000/units/${config.get('unitAddress')}/lifCost`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });

      expect(response).to.have.property('status', 200);
      expect(await response.json()).to.have.property('cost', estimatedCost.toString());
    });
    it('POST /hotels/:hotelAddress/units/:unitAddress/specialLifPrice. Expect 200', async () => {
      const specialLifPrice = 70;
      let body = JSON.stringify({
        password: config.get('password'),
        price: specialLifPrice,
        days: 1,
        from: new Date('10/10/2020'),
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAddress')}/specialLifPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.have.property('status', 200);
      body = JSON.stringify({
        date: Math.round(new Date('10/10/2020').getTime() / 86400000),
      });
      response = await fetch(`http://localhost:3000/units/${config.get('unitAddress')}/reservation`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });
      expect(response).to.have.property('status', 200);
      const { reservation } = await response.json();
      expect(reservation).to.have.property('specialLifPrice', specialLifPrice.toString());
    });
    it('POST /hotels/:hotelAddress/units/:unitAddress/specialLifPrice. Expect 400 #missingPassword', async () => {
      const specialLifPrice = 70;
      let body = JSON.stringify({
        price: specialLifPrice,
        days: 1,
        from: new Date('10/10/2020'),
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAddress')}/specialLifPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.have.property('status', 400);
      expect(await response.json()).to.have.property('code', '#missingPassword');
    });
    it('GET /balance. Expect 200', async () => {
      const body = JSON.stringify({
        cost: 27,
        account: config.get('user'),
      });
      let response = await fetch('http://localhost:3000/balance', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });

      expect(response).to.have.property('status', 200);
    });
  });
  describe('Units fiat prices', function () {
    it('GET /units/:unitAddress/costs. Expect 200', async () => {
      const days = 5;
      const estimatedCost = defaultPrice * days;
      const body = JSON.stringify({
        password: config.get('password'),
        days,
        from: new Date('10/10/2020'),
      });
      let response = await fetch(`http://localhost:3000/units/${config.get('unitAddress')}/cost`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });

      expect(response).to.have.property('status', 200);
      expect(await response.json()).to.have.property('cost', estimatedCost.toFixed(2));
    });
    it('GET /units/:unitAddress/costs. Expect 400 #missingDays', async () => {
      const body = JSON.stringify({
        password: config.get('password'),
        from: new Date('10/10/2020'),
      });
      let response = await fetch(`http://localhost:3000/units/${config.get('unitAddress')}/cost`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });

      expect(response).to.have.property('status', 400);
      expect(await response.json()).to.have.property('code', '#missingDays');
    });
    it('GET /units/:unitAddress/costs. Expect 400 #missingFrom', async () => {
      const body = JSON.stringify({
        password: config.get('password'),
        days: 5,
      });
      let response = await fetch(`http://localhost:3000/units/${config.get('unitAddress')}/cost`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });

      expect(response).to.have.property('status', 400);
      expect(await response.json()).to.have.property('code', '#missingFrom');
    });
    it('POST /hotels/:hotelAddress/units/:unitAddress/specialPrice. Expect 200', async () => {
      const specialPrice = 70;
      let body = JSON.stringify({
        password: config.get('password'),
        price: specialPrice,
        days: 1,
        from: new Date('10/10/2020'),
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAddress')}/specialPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.have.property('status', 200);
      body = JSON.stringify({
        date: Math.round(new Date('10/10/2020').getTime() / 86400000),
      });
      response = await fetch(`http://localhost:3000/units/${config.get('unitAddress')}/reservation`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });
      expect(response).to.have.property('status', 200);
      const { reservation } = await response.json();
      expect(reservation).to.have.property('specialPrice', specialPrice.toFixed(2));
    });
    it('POST /hotels/:hotelAddress/units/:unitAddress/specialPrice. Expect 400 #missingPassword', async () => {
      const specialPrice = 70;
      let body = JSON.stringify({
        price: specialPrice,
        days: 1,
        from: new Date('10/10/2020'),
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAddress')}/specialPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.have.property('status', 400);
      expect(await response.json()).to.have.property('code', '#missingPassword');
    });
  });
});
