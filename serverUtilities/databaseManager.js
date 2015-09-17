var mysql = require('mysql');
/*var pool = mysql.createPool({
  host     : 'us-cdbr-iron-east-02.cleardb.net',
  user     : 'b74609e180ce2b',
  password : '87b88840',
  database : 'heroku_ec961a3d2debbe8'
});*/
var pool = mysql.createPool({
  host     : '103.22.180.250',
  user     : 'qmeappco_qmeapp',
  password : 'lL36n5Xlc3',
  database : 'qmeappco_qmeapp'
});
module.exports = pool;