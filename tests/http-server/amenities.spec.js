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
  it('POST /hotels/:address/unitTypes/TYPE_000/amenities. Expect 200', async () => {
    const amenity = 7
    const body = JSON.stringify({
      'password': config.get('password'),
      amenity
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000/amenities`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.be.ok
    expect(response).to.have.property('status', 200)
    response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })

    const hotels = await response.json()
    const hotel = hotels[config.get('testAddress')]
    expect(hotel.unitTypes['TYPE_000'].amenities).to.include(amenity)
  })
  it('POST /hotels/:address/unitTypes/TYPE_000/amenities. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({
      amenity: 5
    })
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000/amenities`, {
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

  it('POST /hotels/:address/unitTypes/amenities. Expect 400 #missingAmenity', async () => {
    const body = JSON.stringify({
      password: config.get('password')
    })
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000/amenities`, {
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
        expect(res).to.have.property('code', '#missingAmenity')
      })
  })
  it('DELETE /hotels/:address/unitTypes/TYPE_000. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({})
    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000/amenities/5`, {
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
