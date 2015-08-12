/*============================== Function Encrypt Password Start ===========================*/

var passwordEncryption = {};

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

passwordEncryption.encrypt = function (text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
passwordEncryption.decrypt = function (text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}



module.exports = passwordEncryption;
/*============================== Function Encrypt Password End ===========================*/