/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../../config.js')
const { AfterEach,
        BeforeEach,
        Before } = require('../hooks.js')

describe('amenities', function () {
  AfterEach()
  BeforeEach()
  Before()
  it('POST /hotels/:address/confirmBooking. Expect 200')
  it('POST /hotels/:address/confirmBooking. Expect 400 #missingPassword',
  async () => {
    const body = JSON.stringify({
      reservationId: '123'
    })
    const response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/confirmBooking`, {
      method: 'POST',
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
  it('POST /hotels/:address/confirmBooking. Expect 400 #missingReservationId',
  async () => {
    const body = JSON.stringify({
      password: config.get('password')
    })
    const response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/confirmBooking`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.be.ok
    expect(response).to.have.property('status', 400)
    const res = await response.json()
    expect(res).to.have.property('code', '#missingReservationId')
  })
})
