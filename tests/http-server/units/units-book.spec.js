
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const fetch = require('node-fetch');
const config = require('../../../config.js');
const { AfterEach,
  BeforeEach,
  Before } = require('../../hooks.js');

describe('Units books', function () {
  AfterEach();
  BeforeEach();
  Before();
  it('POST /hotels/:hotelAdress/units/:unitAddress/book. Expect 200', async () => {
    const guestData = '0123456789ABCDEF';
    const daysAmount = 1;
    const fromDate = new Date('10/10/2020');

    const body = JSON.stringify({
      account: config.get('user'),
      guest: guestData,
      days: daysAmount,
      from: fromDate,
    });
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAddress')}/book`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.have.property('status', 200);

    response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/bookings`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    expect(response).to.have.property('status', 200);
    const { bookings } = await response.json();

    expect(bookings).to.be.an('array');
    expect(bookings[0]).to.have.property('guestData', guestData);
    expect(bookings[0]).to.have.property('daysAmount', daysAmount.toString());
    expect(Date.parse(bookings[0].fromDate)).to.eql(Date.parse(fromDate));
    expect(bookings[0]).to.have.property('unit', config.get('unitAddress'));
    expect(bookings[0]).to.have.property('from', config.get('user'));
    expect(bookings[0]).to.have.property('id');
  });
  it('POST /hotels/:hotelAdress/units/:unitAddress/book. Expect 400 #missingFrom', async () => {
    const guestData = '0123456789ABCDEF';
    const body = JSON.stringify({
      account: config.get('user'),
      guest: guestData,
      days: 5,
    });
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAddress')}/book`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.have.property('status', 400);
    expect(await response.json()).to.have.property('code', '#missingFrom');
  });
  it('POST /hotels/:hotelAdress/units/:unitAddress/lifBook. Expect 200', async () => {
    const guestData = '0123456789ABCDEF';
    const daysAmount = 1;
    const fromDate = new Date('10/10/2020');

    const body = JSON.stringify({
      account: config.get('user'),
      guest: guestData,
      days: daysAmount,
      from: fromDate,
    });
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAddress')}/lifBook`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.have.property('status', 200);
    response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/bookings`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    expect(response).to.have.property('status', 200);
    const { bookings } = await response.json();

    expect(bookings).to.be.an('array');
    expect(bookings[0]).to.have.property('guestData', guestData);
    expect(bookings[0]).to.have.property('daysAmount', daysAmount.toString());
    expect(Date.parse(bookings[0].fromDate)).to.eql(Date.parse(fromDate));
    expect(bookings[0]).to.have.property('unit', config.get('unitAddress'));
    expect(bookings[0]).to.have.property('from', config.get('user'));
    expect(bookings[0]).to.have.property('id');
  });
});
