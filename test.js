const _test = require('./config.json');
const fs = require('fs');
const configFile = './config.json';

_test.tacos = 'Yes';
_test.variables.longJohnSilvers = 'Oh yea';
fs.writeFile(configFile, JSON.stringify(_test, null, 2), function(e){
  if(e) throw e;
  console.log('Updated');
});
