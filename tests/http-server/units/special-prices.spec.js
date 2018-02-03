/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../../../config.js')
const { AfterEach,
        BeforeEach,
        Before } = require('../../hooks.js')

describe('Hotels', function () {
  AfterEach()
  BeforeEach()
  Before()

  it('POST /hotels/:address/units/:unit/specialLifPrice. Expect 200', async () => {
    const specialLifPrice = 70
    let body = JSON.stringify({
      password: config.get('password'),
      price: specialLifPrice,
      days: 1,
      from: new Date('10/10/2020')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/specialLifPrice`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.have.property('status', 200)
    body = JSON.stringify({
      date: Math.round(new Date('10/10/2020').getTime() / 86400000)
    })
    response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/reservation`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })
    expect(response).to.have.property('status', 200)
    const { reservation } = await response.json()
    expect(reservation).to.have.property('specialLifPrice', specialLifPrice.toString())
  })

  it('POST /hotels/:address/units/:unit/specialLifPrice. Expect 400 #missingPassword', async () => {
    const specialLifPrice = 70
    let body = JSON.stringify({
      price: specialLifPrice,
      days: 1,
      from: new Date('10/10/2020')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/specialLifPrice`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.have.property('status', 400)
    expect(await response.json()).to.have.property('code', '#missingPassword')
  })

  it('POST /hotels/:address/units/:unit/specialPrice. Expect 200', async () => {
    const specialPrice = 70
    let body = JSON.stringify({
      password: config.get('password'),
      price: specialPrice,
      days: 1,
      from: new Date('10/10/2020')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/specialPrice`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.have.property('status', 200)
    body = JSON.stringify({
      date: Math.round(new Date('10/10/2020').getTime() / 86400000)
    })
    response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/reservation`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })
    expect(response).to.have.property('status', 200)
    const { reservation } = await response.json()
    expect(reservation).to.have.property('specialPrice', specialPrice.toFixed(2))
  })

  it('POST /hotels/:address/units/:unit/specialPrice. Expect 400 #missingPassword', async () => {
    const specialPrice = 70
    let body = JSON.stringify({
      price: specialPrice,
      days: 1,
      from: new Date('10/10/2020')
    })
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/specialPrice`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    expect(response).to.have.property('status', 400)
    expect(await response.json()).to.have.property('code', '#missingPassword')
  })
})
