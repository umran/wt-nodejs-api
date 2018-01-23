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
  it('POST /hotels/:address/units/:unit/defaultPrice. Expect 200', async () => {
    const price = 78
    const body = JSON.stringify({
      password: config.get('password'),
      price
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultPrice`, {
      method: 'POST',
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
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })
    const { hotel } = await response.json()
    expect(hotel.units[config.get('unitAdress')]).to.have.property('defaultPrice', price.toFixed(2))
  })

  it('POST /hotels/:address/units/:unit/defaultPrice. Expect 400 #missingPassword', async () => {
    const price = 7
    const body = JSON.stringify({
      price
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultPrice`, {
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

  it('POST /hotels/:address/units/:unit/defaultLifPrice. Expect 200', async () => {
    const price = 78
    const body = JSON.stringify({
      password: config.get('password'),
      price
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultLifPrice`, {
      method: 'POST',
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
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })
    const { hotel } = await response.json()
    expect(hotel.units[config.get('unitAdress')]).to.have.property('defaultLifPrice', price)
  })

  it('POST /hotels/:address/units/:unit/defaultLifPrice. Expect 400 #missingPassword', async () => {
    const price = 78
    const body = JSON.stringify({
      price
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultLifPrice`, {
      method: 'POST',
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

  it('POST /hotels/:address/units/:unit/defaultLifPrice. Expect 400 #missingPrice', async () => {
    const body = JSON.stringify({
      password: config.get('password')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultLifPrice`, {
      method: 'POST',
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

  it('POST /hotels/:address/units/:unit/defaultPrice. Expect 400 #missingPassword', async () => {
    const price = 7
    const body = JSON.stringify({
      price
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultPrice`, {
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

  it('POST /hotels/:address/units/:unit/defaultPrice. Expect 400 ##missingPrice', async () => {
    const body = JSON.stringify({
      password: config.get('password')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultPrice`, {
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
    expect(res).to.have.property('code', '#missingPrice')
  })

  it('POST /hotels/:address/units/:unit/currencyCode. Expect 200', async () => {
    const body = JSON.stringify({
      password: config.get('password'),
      code: 948
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/currencyCode`, {
      method: 'POST',
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
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })
    const { hotel } = await response.json()
    expect(hotel.units[config.get('unitAdress')]).to.have.property('currencyCode', 'CHW')
  })
  it('POST /hotels/:address/units/:unit/currencyCode. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({
      code: 948
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/currencyCode`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.be.ok
    expect(response).to.have.property('status', 400)
    const resp = await response.json()
    expect(resp).to.have.property('code', '#missingPassword')
  })
  it('POST /hotels/:address/units/:unit/currencyCode. Expect 400 #missingCode', async () => {
    const body = JSON.stringify({
      password: config.get('password')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/currencyCode`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.be.ok
    expect(response).to.have.property('status', 400)
    const resp = await response.json()
    expect(resp).to.have.property('code', '#missingCode')
  })
})
