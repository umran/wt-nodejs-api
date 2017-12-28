/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../../config.js')
const { AfterEach,
        BeforeEach,
        Before } = require('../hooks.js')

describe('Unit types', function () {
  AfterEach()
  BeforeEach()
  Before()
  it('GET /hotels/:address/unitTypes. Expect 200', async () => {
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(async response => {
        expect(response).to.be.ok
        const res = await response.json()
        expect(response).to.have.property('status', 200)
        expect(res.unitTypes).to.have.property('TYPE_000')
      })
  })
  it('POST /hotels/:address/unitTypes. Expect 200', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      type: 'TYPE_001'
    })
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes`, {
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
  it('POST /hotels/:address/unitTypes. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({
      type: 'TYPE_001'
    })
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes`, {
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
        expect(response).to.have.property('status', 400)
        expect(res).to.have.property('code', '#missingPassword')
      })
  })

  it('POST /hotels/:address/unitTypes. Expect 400 #missingType', async () => {
    const body = JSON.stringify({
      password: config.get('password')
    })
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes`, {
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
        expect(response).to.have.property('status', 400)
        expect(res).to.have.property('code', '#missingType')
      })
  })
  it('DELETE /hotels/:address/unitTypes/TYPE_000. Expect 400 #missingType', async () => {
    const body = JSON.stringify({
      'password': config.get('password')
    })
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
      .then(async response => {
        expect(response).to.be.ok
        expect(response).to.have.property('status', 200)
      })
  })

  it('DELETE /hotels/:address/unitTypes/TYPE_000. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({})
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
      .then(async response => {
        expect(response).to.be.ok
        const res = await response.json()
        expect(response).to.have.property('status', 400)
        expect(res).to.have.property('code', '#missingPassword')
      })
  })
})

describe('Unit', function () {
  AfterEach()
  BeforeEach()
  Before()
  it('POST /hotels/:address/unitTypes. Expect 200', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      type: 'TYPE_001'
    })
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes`, {
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
  it('POST /hotels/:address/unitTypes. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({
      type: 'TYPE_001'
    })
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes`, {
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
        expect(response).to.have.property('status', 400)
        expect(res).to.have.property('code', '#missingPassword')
      })
  })

  it('POST /hotels/:address/unitTypes. Expect 400 #missingType', async () => {
    const body = JSON.stringify({
      password: config.get('password')
    })
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes`, {
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
        expect(response).to.have.property('status', 400)
        expect(res).to.have.property('code', '#missingType')
      })
  })
  it('DELETE /hotels/:address/unitTypes/TYPE_000. Expect 400 #missingType', async () => {
    const body = JSON.stringify({
      'password': config.get('password')
    })
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
      .then(async response => {
        expect(response).to.be.ok
        expect(response).to.have.property('status', 200)
      })
  })

  it('DELETE /hotels/:address/unitTypes/TYPE_000. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({})
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
      .then(async response => {
        expect(response).to.be.ok
        const res = await response.json()
        expect(response).to.have.property('status', 400)
        expect(res).to.have.property('code', '#missingPassword')
      })
  })
})
