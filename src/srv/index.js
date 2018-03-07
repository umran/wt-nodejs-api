const { app } = require('./service');
const config = require('../../config');

app.listen(config.get('port'), () => {
  console.log(`WT API AT ${config.get('port')}!`);
});
