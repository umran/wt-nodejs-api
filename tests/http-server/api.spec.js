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
    await fetch('http://localhost:3000/', {
      method: 'GET'
    })
      .then((res) => {
        expect(res).to.be.ok
      })
      .catch(e => {
        expect(e).to.not.exist
      })
  })
  it('GET /docs', async () => {
    await fetch('http://localhost:3000/docs', {
      method: 'GET'
    })
      .then((res) => {
        expect(res).to.be.ok
      })
      .catch(e => {
        expect(e).to.not.exist
      })
  })
})
