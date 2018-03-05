/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../../../config.js')
const { AfterEach,
        BeforeEach,
        Before } = require('../../hooks.js')

describe('Unit types', function () {
  AfterEach()
  BeforeEach()
  Before()
  const unitType = 'TYPE_000'
  const imageUrl = 'picture.jpg'
  it('POST /hotels/:hotelAddress/unitTypes. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({
      unitType: 'TYPE_001'
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.be.ok
    const res = await response.json()
    expect(response).to.have.property('status', 400)
    expect(res).to.have.property('code', '#missingPassword')
  })
  it('PUT /hotels/:hotelAddress/unitTypes/:unitType. Expect 200', async () => {
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
  it('PUT /hotels/:hotelAddress/unitTypes/:unitType. Expect 400 #missingPassword', async () => {
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
  it('PUT /hotels/:hotelAddress/unitTypes/:unitType. Expect 400 #missingDescription', async () => {
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
  it('PUT /hotels/:hotelAddress/unitTypes/:unitType. Expect 400 #missingMinGuests', async () => {
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
  it('PUT /hotels/:hotelAddress/unitTypes/:unitType. Expect 400 #missingMaxGuests', async () => {
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
  it('PUT /hotels/:hotelAddress/unitTypes/:unitType. Expect 400 #missingPrice', async () => {
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
  describe('Unit types images', function () {
    it('POST /hotels/:hotelAddress/unitTypes/:unitType/images. Expect 200', async () => {
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
    it('POST /hotels/:hotelAddress/unitTypes/:unitType/images. Expect 400 #missingPassword', async () => {
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
    it('POST /hotels/:hotelAddress/unitTypes/:unitType/images. Expect 400 #missingUrl', async () => {
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
    it('DELETE /hotels/:hotelAddress/unitTypes/TYPE_000/images/:id. Expect 200', async () => {
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
  })
  describe('Unit types amenities', function () {
    it('POST /hotels/:hotelAddress/unitTypes/TYPE_000/amenities. Expect 200', async () => {
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
    it('POST /hotels/:hotelAddress/unitTypes/TYPE_000/amenities. Expect 400 #missingPassword', async () => {
      const body = JSON.stringify({
        amenity: 5
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
      const res = await response.json()
      expect(response).to.have.property('status', 400)
      expect(res).to.have.property('code', '#missingPassword')
    })
    it('POST /hotels/:hotelAddress/unitTypes/amenities. Expect 400 #missingAmenity', async () => {
      const body = JSON.stringify({
        password: config.get('password')
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
      const res = await response.json()
      expect(response).to.have.property('status', 400)
      expect(res).to.have.property('code', '#missingAmenity')
    })
    it('DELETE /hotels/:hotelAddress/unitTypes/TYPE_000. Expect 200', async () => {
      const defaultAmenity = 5
      const body = JSON.stringify({
        password: config.get('password')
      })

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000/amenities/${defaultAmenity}`, {
        method: 'DELETE',
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
      expect(hotel.unitTypes['TYPE_000'].amenities).to.not.include(defaultAmenity)
    })
    it('DELETE /hotels/:hotelAddress/unitTypes/TYPE_000. Expect 400 #missingPassword', async () => {
      const body = JSON.stringify({})
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/TYPE_000/amenities/5`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.be.ok
      const res = await response.json()
      expect(response).to.have.property('status', 400)
      expect(res).to.have.property('code', '#missingPassword')
    })
  })
})
