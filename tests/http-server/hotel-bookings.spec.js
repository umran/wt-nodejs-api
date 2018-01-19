/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../../config.js')
const { AfterEach,
        BeforeEach,
        Before } = require('../hooks.js')

describe('Hotels bookings', function () {
  AfterEach()
  BeforeEach()
  Before()
  it('POST /hotels/:address/confirmation. Expect 200',
  async () => {
    const body = JSON.stringify({
      password: config.get('password'),
      required: true
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/confirmation`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.be.ok
    expect(response).to.have.property('status', 200)
    response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    expect(response).to.have.property('status', 200)
    const { hotel } = await response.json()
    expect(hotel).to.have.property('waitConfirmation', true)
  })
  it('POST /hotels/:address/confirmation. Expect 400 #missingPassword',
  async () => {
    const body = JSON.stringify({
      required: '123'
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/confirmation`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.be.ok
    expect(response).to.have.property('status', 400)
    const res = await response.json()
    expect(res).to.have.property('code', '#missingPassword')
  })
  it('POST /hotels/:address/confirmation. Expect 400 #missingRequired',
  async () => {
    const body = JSON.stringify({
      password: config.get('password')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/confirmation`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.be.ok
    expect(response).to.have.property('status', 400)
    const res = await response.json()
    expect(res).to.have.property('code', '#missingRequired')
  })

  it('GET /hotels/:hotelAdress/bookings. Expect 200', async () => {
    const body = JSON.stringify({
      block: 1
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/bookings`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })

    expect(response).to.have.property('status', 200)
    const { bookings } = await response.json()
    expect(bookings).to.be.an('array')
  })
  it('GET /hotels/:hotelAdress/bookings from creation block. Expect 200', async () => {
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/bookings`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    expect(response).to.have.property('status', 200)
    const { bookings } = await response.json()
    expect(bookings).to.be.an('array')
  })
})
