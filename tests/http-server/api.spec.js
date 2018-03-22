/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const fetch = require('node-fetch');
const config = require('../../config');
const { AfterEach,
  BeforeEach,
  Before } = require('../hooks.js');

describe('API', function () {
  AfterEach();
  BeforeEach();
  Before();
  it('GET /', async () => {
    const response = await fetch('http://localhost:3000/', {
      method: 'GET',
    });
    expect(response).to.be.ok;
    const res = await response.json();
    expect(res).to.have.property('version');
    expect(res).to.have.property('service');
    expect(res).to.have.property('docs');
    expect(res).to.have.property('repository');
  });
  it('GET /docs', async () => {
    const response = await fetch('http://localhost:3000/docs', {
      method: 'GET',
    });
    expect(response).to.be.ok;
  });
  it('GET with no whilisted ip. Expect #whiteList', async () => {
    config.set('whiteList', ['11.22.33.44']);
    const response = await fetch('http://localhost:3000/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const res = await response.json();
    expect(res).to.have.property('code', '#whiteList');
  });
  it('Allow all ips with empty whiteList', async () => {
    config.set('whiteList', []);
    const response = await fetch('http://localhost:3000/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    expect(response).to.have.property('status', 200);
  });
});
