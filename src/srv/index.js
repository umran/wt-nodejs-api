const { app } = require('./service')
const config = require('../../config.js')
app.listen(config.get('port'), () => {
  console.log('WT API AT 3000!')
})
