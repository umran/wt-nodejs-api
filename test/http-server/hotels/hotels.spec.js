/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const fetch = require('node-fetch');
const config = require('../../../src/config');
const { PASSWORD_HEADER } = require('../../../src/helpers/validators');
const { AfterEach,
  BeforeEach,
  Before } = require('../../hooks.js');

const getGenericHeaders = () => {
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  headers[PASSWORD_HEADER] = config.get('password');
  return headers;
};

describe('Hotels', function () {
  AfterEach();
  BeforeEach();
  Before();

  it('POST /hotels. Expect 200', async () => {
    const hotelName = 'Test Hotel';
    const hotelDesc = 'Natural and charming atmosphere';
    const body = JSON.stringify({
      'description': hotelDesc,
      'name': hotelName,
    });

    let response = await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: getGenericHeaders(),
      body,
    });
    expect(response).to.have.property('status', 200);

    response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: getGenericHeaders(),
    });

    const hotels = await response.json();
    let hotelAddresses = Object.keys(hotels);
    const hotel = hotels[hotelAddresses[hotelAddresses.length - 1]];
    expect(hotel).to.have.property('name', hotelName);
    expect(hotel).to.have.property('description', hotelDesc);
  });

  it('POST /hotels. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({
      'name': 'string',
      'description': 'string',
    });
    let response = await fetch('http://localhost:3000/hotels', {
      method: 'POST',
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

  it('POST /hotels. Expect 400 #missingName', async () => {
    const body = JSON.stringify({
      'description': 'string',
    });

    let response = await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: getGenericHeaders(),
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingName');
  });

  it('POST /hotels. Expect 400 #missingDescription', async () => {
    const body = JSON.stringify({
      'name': 'string',
    });

    let response = await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: getGenericHeaders(),
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingDescription');
  });

  it('GET /hotels. Expect 200', async () => {
    let response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: getGenericHeaders(),
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
  });

  it('GET /hotels/:hotelAddress. Expect 200', async () => {
    const response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
    const { hotel } = await response.json();
    expect(hotel).to.have.property('name', 'Test Hotel');
    expect(hotel).to.have.property('description', 'Test Hotel desccription');
  });

  it('PUT /hotels/:hotelAddress. Expect 200 ', async () => {
    const name = 'WT Hotel';
    const description = 'Best hotel for developers.';

    let body = JSON.stringify({
      name,
      description,
    });

    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'PUT',
      headers: getGenericHeaders(),
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
    body = JSON.stringify({
      password: config.get('password'),
    });
    response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: getGenericHeaders(),
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
    const hotels = await response.json();
    let hotelAddresses = Object.keys(hotels);
    const hotel = hotels[hotelAddresses[hotelAddresses.length - 1]];
    expect(hotel).to.have.property('name', name);
    expect(hotel).to.have.property('description', description);
  });

  it('PUT /hotels/:hotelAddress. Expect 400 #missingPassword', async () => {
    const name = 'WT Hotel';
    const description = 'Best hotel for developers.';

    let body = JSON.stringify({
      name,
      description,
    });

    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
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
 
  it('PUT /hotels/:hotelAddress. Expect 400 #missingName', async () => {
    const description = 'Best hotel for developers.';

    let body = JSON.stringify({
      description,
    });

    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'PUT',
      headers: getGenericHeaders(),
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingName');
  });
 
  it('PUT /hotels/:hotelAddress . Expect 400 #missingDescription', async () => {
    const name = 'WT Hotel';

    let body = JSON.stringify({
      name,
    });

    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'PUT',
      headers: getGenericHeaders(),
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingDescription');
  });

  it('DELETE /hotels/:hotelAddress. Expect 204', async () => {
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'DELETE',
      headers: getGenericHeaders(),
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 204);
    response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: getGenericHeaders(),
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
    const hotels = await response.json();
    expect(hotels).to.be.null;
  });

  it('DELETE /hotels/:hotelAddress. Expect 400 #missingPassword', async () => {
    const response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingPassword');
  });
});
