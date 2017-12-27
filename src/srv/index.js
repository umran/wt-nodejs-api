const express = require('express')
const { router } = require('./routes')
const { unitTypesRouter } = require('./routes/unit-types')
const { amenitiesRouter } = require('./routes/amenities')
const { unitsRouter } = require('./routes/units')
const { walletRouter } = require('./routes/wallet')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const app = express()

app.use('/docs', swaggerUi.serve, swaggerUi.setup(require('../../docs/swagger.json')))
app.use(bodyParser.json())
app.use(router)
app.use(unitTypesRouter)
app.use(amenitiesRouter)
app.use(unitsRouter)
app.use(walletRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(400).json({
    code: err.code,
    short: err.short,
    long: err.long
  })
})

app.listen(3000, () => {
  console.log('WT API AT 3000!')
})
