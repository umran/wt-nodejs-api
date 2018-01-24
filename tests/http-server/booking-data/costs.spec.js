/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../../../config.js')
const { AfterEach,
        BeforeEach,
        Before } = require('../../hooks.js')

describe('Costs', function () {
  const defaultPrice = 78
  const defaultLifPrice = 75
  AfterEach()
  BeforeEach()
  Before()
  it('GET /units/:unitAdress/costs. Expect 200', async () => {
    const days = 5
    const estimatedCost = defaultPrice * days
    const body = JSON.stringify({
      password: config.get('password'),
      days,
      from: new Date('10/10/2020')
    })
    let response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/cost`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })

    expect(response).to.have.property('status', 200)
    expect(await response.json()).to.have.property('cost', estimatedCost.toFixed(2))
  })
  it('GET /units/:unitAdress/costs. Expect 400 #missingDays', async () => {
    const body = JSON.stringify({
      password: config.get('password'),
      from: new Date('10/10/2020')
    })
    let response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/cost`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })

    expect(response).to.have.property('status', 400)
    expect(await response.json()).to.have.property('code', '#missingDays')
  })

  it('GET /units/:unitAdress/costs. Expect 400 #missingFrom', async () => {
    const body = JSON.stringify({
      password: config.get('password'),
      days: 5
    })
    let response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/cost`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })

    expect(response).to.have.property('status', 400)
    expect(await response.json()).to.have.property('code', '#missingFrom')
  })
  it('GET /units/:unitAdress/lifCosts. Expect 200', async () => {
    const days = 5
    const estimatedCost = defaultLifPrice * days
    const body = JSON.stringify({
      password: config.get('password'),
      days,
      from: new Date('10/10/2020')
    })
    let response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/lifCost`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body
    })

    expect(response).to.have.property('status', 200)
    expect(await response.json()).to.have.property('cost', estimatedCost.toString())
  })
})
