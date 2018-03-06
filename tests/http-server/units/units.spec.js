/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const fetch = require('node-fetch');
const config = require('../../../config.js');
const { AfterEach,
  BeforeEach,
  Before } = require('../../hooks.js');

describe('Units', function () {
  AfterEach();
  BeforeEach();
  Before();
  const unitType = 'TYPE_000';
  it('POST /hotels/:hotelAddress/unitTypes/:unitType/units. Expect 200', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
    });
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitType}/units`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
    response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      body,
    });
    const hotels = await response.json();
    const hotel = hotels[config.get('testAddress')];
    let unitAddresses = Object.keys(hotel.units);
    const unitAddress = hotel.unitAddresses[unitAddresses.length - 1];
    const unit = hotel.units[unitAddress];
    expect(unit).to.have.property('unitType', unitType);
  });
  it('DELETE /hotels/:hotelAddress/unitTypes/:unitType/units/:unitAddress. Expect 200 ', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
    });
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000/units/${config.get('unitAddress')}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.have.property('status', 200);
    response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      body,
    });
    expect(response).to.have.property('status', 200);
    const hotels = await response.json();
    const hotel = hotels[config.get('testAddress')];
    expect(hotel.units).to.not.have.property(config.get('unitAddress'));
  });
  it('GET /units/:unitAddress/reservation. Expect 200 ', async () => {
    const body = JSON.stringify({
      date: Math.round(new Date('10/10/2020').getTime() / 86400000),
    });

    let response = await fetch(`http://localhost:3000/units/${config.get('unitAddress')}/reservation`, {
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
    expect(reservation).to.have.property('specialPrice');
    expect(reservation).to.have.property('specialLifPrice');
    expect(reservation).to.have.property('bookedBy');
  });
  it('GET /units/:unitAddress/available. Expect 200', async () => {
    const days = 5;
    const body = JSON.stringify({
      password: config.get('password'),
      days,
      from: new Date('10/10/2020'),
    });
    let response = await fetch(`http://localhost:3000/units/${config.get('unitAddress')}/available`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      body,
    });
    expect(response).to.have.property('status', 200);
    expect(await response.json()).to.have.property('available', true);
  });
  it('GET /units/:unitAddress/available. Expect 400 #missingDays', async () => {
    const body = JSON.stringify({
      from: new Date('10/10/2020'),
    });
    let response = await fetch(`http://localhost:3000/units/${config.get('unitAddress')}/available`, {
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
  it('GET /units/:unitAddress/available. Expect 400 #missingFrom', async () => {
    const days = 5;
    const body = JSON.stringify({
      days,
    });
    let response = await fetch(`http://localhost:3000/units/${config.get('unitAddress')}/available`, {
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
});
