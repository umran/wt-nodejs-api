/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const { AfterEach,
        BeforeEach,
        Before } = require('../hooks.js')

describe('API', function () {
  AfterEach()
  BeforeEach()
  Before()
  it('GET /', async () => {
    let response = await fetch('http://localhost:3000/', {
      method: 'GET'
    })
    expect(response).to.be.ok
  })
  it('GET /docs', async () => {
    let response = await fetch('http://localhost:3000/docs', {
      method: 'GET'
    })
    expect(response).to.be.ok
  })
})
