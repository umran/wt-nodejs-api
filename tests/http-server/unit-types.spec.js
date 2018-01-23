/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../../config.js')
const { AfterEach,
        BeforeEach,
        Before } = require('../hooks.js')

describe('Unit', function () {
  AfterEach()
  BeforeEach()
  Before()
  const unitType = 'TYPE_000'
  const imageUrl = 'picture.jpg'

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

  it('POST /hotels/:address/unitTypes/:type/images. Expect 200', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      'url': imageUrl
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitType}/images`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.have.property('status', 200)
    response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })

    const {hotel} = await response.json()
    expect(hotel.unitTypes[unitType].images).to.include(imageUrl)
  })

  it('POST /hotels/:address/unitTypes/:type/images. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({
      'url': imageUrl
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitType}/images`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.have.property('status', 400)
    const res = await response.json()
    expect(res).to.have.property('code', '#missingPassword')
  })

  it('POST /hotels/:address/unitTypes/:type/images. Expect 400 #missingUrl', async () => {
    const body = JSON.stringify({
      'password': config.get('password')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitType}/images`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.have.property('status', 400)
    const res = await response.json()
    expect(res).to.have.property('code', '#missingUrl')
  })

  it('DELETE /hotels/:address/unitTypes/TYPE_000/images/:id. Expect 200', async () => {
    const body = JSON.stringify({
      password: config.get('password')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000/images/0`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })
    expect(response).to.be.ok
    expect(response).to.have.property('status', 204)

    response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })
    expect(response).to.have.property('status', 200)
    let {hotel} = await response.json()
    expect(hotel.unitTypes[unitType].images).to.not.include('test-image.jpeg')
  })

  it('PUT /hotels/:address/unitTypes/:type. Expect 200', async () => {
    const description = 'Rural family cabin'
    const minGuests = 1
    const maxGuests = 5
    const price = '15'
    const body = JSON.stringify({
      password: config.get('password'),
      description,
      minGuests,
      maxGuests,
      price
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitType}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.have.property('status', 200)
    response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })

    const { hotel } = await response.json()
    expect(hotel.unitTypes[unitType].info).to.have.property('description', description)
    expect(hotel.unitTypes[unitType].info).to.have.property('minGuests', minGuests)
    expect(hotel.unitTypes[unitType].info).to.have.property('maxGuests', maxGuests)
    expect(hotel.unitTypes[unitType].info).to.have.property('price', price)
  })

  it('PUT /hotels/:address/unitTypes/:type. Expect 400 #missingPassword', async () => {
    const description = 'Rural family cabin'
    const minGuests = 1
    const maxGuests = 5
    const price = '15'
    const body = JSON.stringify({
      description,
      minGuests,
      maxGuests,
      price
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitType}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })

    expect(response).to.have.property('status', 400)
    const resp = await response.json()
    expect(resp).to.have.property('code', '#missingPassword')
  })

  it('PUT /hotels/:address/unitTypes/:type. Expect 400 #missingDescription', async () => {
    const minGuests = 1
    const maxGuests = 5
    const price = '15'
    const body = JSON.stringify({
      password: config.get('password'),
      minGuests,
      maxGuests,
      price
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitType}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })

    expect(response).to.have.property('status', 400)
    const resp = await response.json()
    expect(resp).to.have.property('code', '#missingDescription')
  })

  it('PUT /hotels/:address/unitTypes/:type. Expect 400 #missingMinGuests', async () => {
    const description = 'Rural family cabin'
    const maxGuests = 5
    const price = '15'
    const body = JSON.stringify({
      password: config.get('password'),
      description,
      maxGuests,
      price
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitType}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })

    expect(response).to.have.property('status', 400)
    const resp = await response.json()
    expect(resp).to.have.property('code', '#missingMinGuests')
  })

  it('PUT /hotels/:address/unitTypes/:type. Expect 400 #missingMaxGuests', async () => {
    const description = 'Rural family cabin'
    const minGuests = 1
    const price = '15'
    const body = JSON.stringify({
      password: config.get('password'),
      description,
      minGuests,
      price
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitType}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })

    expect(response).to.have.property('status', 400)
    const resp = await response.json()
    expect(resp).to.have.property('code', '#missingMaxGuests')
  })

  it('PUT /hotels/:address/unitTypes/:type. Expect 400 #missingPrice', async () => {
    const description = 'Rural family cabin'
    const minGuests = 1
    const maxGuests = 5
    const body = JSON.stringify({
      password: config.get('password'),
      description,
      minGuests,
      maxGuests
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitType}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })

    expect(response).to.have.property('status', 400)
    const resp = await response.json()
    expect(resp).to.have.property('code', '#missingPrice')
  })
})
