var apnagent = require('apnagent');
var agent = new apnagent.Agent();
var join = require('path').join;

  // configure agent
  agent 
    .set('cert file', join(__dirname, '../', 'conf/QmeCert.pem'))
    .set('key file', join(__dirname, '../', 'conf/QmeKey.pem'))
    .set('passphrase', '5897497Duiz')
    .enable('sandbox');

   // common settings
  agent
    .set('expires', '1d')
    .set('reconnect delay', '1s')
    .set('cache ttl', '30m');

  agent.connect(function (err) {
    if (err) throw err;
    console.log('apn agent running');
  });

module.exports = agent;

/*
 agent.createMessage()
    .device("6ce53b920676f723d5f40b13a0a86f43eda8f42e499b4f5c64a5966b290397da")
    .alert("Hello Dui Dui")
    .sound("Queue.aiff")
    .send(function (err) {
      // handle apnagent custom errors
      if (err && err.toJSON) {
        console.log("JSON Error");
      } 

      // handle anything else (not likely)
      else if (err) {
        console.log("Error");
      }

      // it was a success
      else {
        console.log("Success");
      }
    });
*/