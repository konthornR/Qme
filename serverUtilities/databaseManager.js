var mysql = require('mysql');
/*var pool = mysql.createPool({
  host     : 'us-cdbr-iron-east-02.cleardb.net',
  user     : 'b74609e180ce2b',
  password : '87b88840',
  database : 'heroku_ec961a3d2debbe8'
});*/
var pool = mysql.createPool({
  //host     : '188.166.250.226',
  host     : 'localhost',
  user     : 'root',
  password : 'qmeapp100millions',
  database : 'qmeapp_database'
});
module.exports = pool;