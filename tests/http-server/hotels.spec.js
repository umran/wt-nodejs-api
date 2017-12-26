/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../../config.js')
const { AfterEach,
        BeforeEach,
        Before } = require('../hooks.js')

describe('Hotels', function () {
  AfterEach()
  BeforeEach()
  Before()
  it('GET /hotels. Expect 200', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      'description': 'string',
      'name': 'name'
    })

    await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })
      .then(async response => {
        expect(response).to.be.ok
        const res = await response.json()
        expect(response).to.have.property('status', 200)
      })
  })
  it('POST /hotels. Expect 200', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      'description': 'string',
      'name': 'name'
    })
    await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
      .then(async response => {
        expect(response).to.be.ok
        const res = await response.json()
        expect(response).to.have.property('status', 200)
      })
  })
  it('POST /hotels. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({
      'name': 'string',
      'description': 'string'
    })
    await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
      .then(async response => {
        expect(response).to.be.ok
        expect(response).to.have.property('status', 400)
        const res = await response.json()
        expect(res).to.have.property('code', '#missingPassword')
      })
  })
  it('POST /hotels. Expect 400 #missingName', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      'description': 'string'
    })

    await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then(async response => {
        expect(response).to.be.ok
        expect(response).to.have.property('status', 400)
        const res = await response.json()
        expect(res).to.have.property('code', '#missingName')
      })
  })
  it('POST /hotels. Expect 400 #missingDescription', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      'name': 'string'
    })

    await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
      .then(async response => {
        expect(response).to.be.ok
        expect(response).to.have.property('status', 400)
        const res = await response.json()
        expect(res).to.have.property('code', '#missingDescription')
      })
  })
})
describe('Hotel', function () {
  AfterEach()
  BeforeEach()
  Before()
  it('GET /hotels/:address. Expect 200')
  it('GET /hotels/:address. Expect 400')
})
