/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../../../config.js')
const { AfterEach,
        BeforeEach,
        Before } = require('../../hooks.js')

describe('Hotel images', function () {
  AfterEach()
  BeforeEach()
  Before()
  const imageUrl = 'test.jpg'
  it('POST /hotels/:address/images. Expect 200', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      'url': imageUrl
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/images`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
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
    expect(hotel.images).to.include(imageUrl)
  })
  it('POST /hotels/:address/images. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({
      'url': 'http://images.com/123'
    })

    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/images`, {
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
  it('POST /hotels/:address/images. Expect 400 #missingUrl', async () => {
    const body = JSON.stringify({
      'password': config.get('password')
    })

    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/images`, {
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
        expect(res).to.have.property('code', '#missingUrl')
      })
  })

  it('DELETE /hotels/:address/images/:id. Expect 200', async () => {
    const body = JSON.stringify({
      'password': config.get('password')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/images/0`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.be.ok
    expect(response).to.have.property('status', 204)

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
    expect(hotel.images).to.not.include(imageUrl)
  })

  it('DELETE /hotels/:address/images/:id/0. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({})

    await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/images/0`, {
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
