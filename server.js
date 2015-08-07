var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);

var url  = require('url');
var _ = require('underscore');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var passport = require('passport');
var passportLocal = require('passport-local');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ 
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

http.listen(process.env.PORT || 3000)
/*============================== Function Encrypt Password Start ===========================*/
// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
/*============================== Function Encrypt Password End ===========================*/

/*============================== Function Check Allow Access Start ===========================*/
var allowAccess = function(req){
	var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var result = false;
    if(query && query.companyId){
    	if(req.isAuthenticated() && req.user && req.user.companyIdList){
    		_.each(req.user.companyIdList, function(companyId){
				if(companyId.toString() === query.companyId){
					result = true;
				}
			});	
    	}
    }
    return result;
}
/*============================== Function Check Allow Access End ===========================*/
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});


app.get('/LogIn', function(req,res){
	res.sendfile(__dirname + '/public/account/logIn.html');
});

app.get('/QueueLists', function (req, res) {
    if(allowAccess(req))
    	res.sendfile(__dirname + '/public/foreground/queueList.html');
    else
    	res.sendfile(__dirname + '/public/index.html');  
});

app.get('/ReserveQueue', function (req, res) {
	if(allowAccess(req))
  		res.sendfile(__dirname + '/public/foreground/reservequeue.html');
  	else
    	res.sendfile(__dirname + '/public/index.html');
});

app.get('/CallQueue', function (req, res) {
  	if(allowAccess(req))
  		res.sendfile(__dirname + '/public/foreground/callqueue.html');
  	else
    	res.sendfile(__dirname + '/public/index.html');
});

app.get('/admin/CreateOrJoinCompany', function (req, res) {
  	res.sendfile(__dirname + '/public/admin/createOrJoinCompany.html');
});

app.get('/admin/SignUp', function (req, res) {
  	res.sendfile(__dirname + '/public/admin/signup.html');
});



var mysql = require('mysql');
var pool = mysql.createPool({
  host     : 'us-cdbr-iron-east-02.cleardb.net',
  user     : 'b74609e180ce2b',
  password : '87b88840',
  database : 'heroku_ec961a3d2debbe8'
});

/*============================== Log In Session Start ===========================*/
app.get('/UserAuthentication', function(req,res){
	res.json({
		"isAuthenticated" : req.isAuthenticated(),
		"user" : req.user
	});
});

passport.use(new passportLocal.Strategy(function(username,password,done){
	pool.getConnection(function(err, connection){
		if(err){
			connection.release();
			console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
			done(null,null); 
			return;
		}
		var query = connection.query('SELECT * FROM user WHERE username = ?', username, function(err, result){
			if (err) { 
		        throw err;
	      	}else{
	      		if(result.length==1){
	      			if(password === decrypt(result[0].password)){
	      				done(null,{ id: result[0].id})	
	      			}else{
						done(null,null);
					}	      			
	      		}else{
	      			done(null,null);
	      		}	      		
	      	}   
		});
		connection.release();
	});
}));

passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	//Query database or cache here!
	pool.getConnection(function(err, connection){		
		var companyIdList = [];
		if(err){
			connection.release();
			console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
			done(null,{ id: id, companyIdList: companyIdList})
			return;
		}
		var query2 = connection.query('SELECT * FROM userownshop WHERE userid = ?', id, function(err2, result2){
			if(err2){
				throw err2;
			}else{
				if(result2.length>0){
					_.each(result2, function(row){
						companyIdList.push(row.companyid);
					});	
				}
      		}	
			done(null,{ id: id, companyIdList: companyIdList})
		});   
		connection.release();
	});
});

app.get('/logout', function(req,res){
	req.logout();
	res.redirect('/HomePage');
});

app.post('/login', passport.authenticate('local'), function(req,res){
	res.redirect('/');
});

/*============================== Log In Session End ===========================*/

/*============================== SignUp Session Start ===========================*/
app.post('/admin/signup', function(req,res){
	var newUsername = req.body.username;
	pool.getConnection(function(err, connection){
		if(err){
			connection.release();
			console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
          	res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		}
		var query = connection.query('SELECT * FROM user WHERE username = ?', newUsername, function(err, result){
			if (err) { 
		        throw err;
	      	}else{
	      		if(result.length >= 1){
	      			res.send(401, 'string');	      			
	      		}else{
	      			var post  = {
						username: newUsername, 
						password: encrypt(req.body.password)
					};
	      			var insertQuery = connection.query('INSERT INTO user SET ?', post, function(err2, result2) {
					  	if (err2) { 
					        throw err2;
				      	}
					});				
	      		}	      		
	      	}   
		});
		connection.release();
	});
	
});
/*============================== SignUp Session End ===========================*/

var customer_format = 	{
					'Name': '',
					'NumberOfSeats': 0,
					'Id': '',
					'SocketId': [],
					'NextQueueFlag': false,
					'QueuePosition' : 0,
					'GroupColor' : ""
				};

/*============================   Global Entity Start  =================================*/	
var GlobalCompany = function(){
	this.allCompany = [];
};
GlobalCompany.prototype.getCompanyById = function(id){
	for(var i =0; i<this.allCompany.length; i++){
		if(this.allCompany[i].companyId == id){
			return this.allCompany[i];
		}
	}
};
GlobalCompany.prototype.addCompany = function(company){
	this.allCompany.push(company);
};

var globalCompany = new GlobalCompany();

/*init company from database*/
pool.getConnection(function(err, connection){
	if(err){
		connection.release();          	
		console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
		return;
	}
	var query = connection.query('SELECT * FROM company', function(err, result){
		if (err) { 
	        throw err;
      	}else{
      		_.each(result, function(row){
      			var newCompany = new Company(row.id.toString());
				globalCompany.addCompany(newCompany);
			});	
      	}   
	});
	connection.release();
});

/*============================   Global Entity End  =================================*/	


/*============================   Each Company Entity Start  =================================*/			
var Company = function(id){
	this.companyId = id;
	this.allCustomers = [];
	//default table config
	this.tableConfig = 	[{
						'greater' : 1,
						'less' : 3,
						'customers' : [],
						'latestQueuePosition' : 0,
						'groupColor' : "red"
					},
					{
						'greater' : 4,
						'less' : 6,
						'customers' : [],
						'latestQueuePosition' : 0,
						'groupColor' : "green"						
					},
					{
						'greater' : 7,
						'less' : 9,
						'customers' : [],
						'latestQueuePosition' : 0,
						'groupColor' : "blue"		
					},
					{
						'greater' : 10,
						'less' : 100,
						'customers' : [],
						'latestQueuePosition' : 0,
						'groupColor' : "black"		
					}]; 
	this.callingQueue = [];
};

/*============================   Each Comapany Entity End  =================================*/	

io.sockets.on('connection', function(socket){;
	//console.log("=================" + socket.id + " connect ========================")
	io.sockets.socket(socket.id).emit("socket id connection", {'SocketId': socket.id});

	/*============================   Global Function Start  =================================*/	
	socket.on('global create company', function(data){		
		// Have to push in database first
		pool.getConnection(function(err, connection){
			if(err){
				connection.release();
				console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
				io.sockets.emit('database connection error', globalCompany.allCompany); 
				return;
			}
			var query = connection.query('SELECT * FROM company WHERE name = ?', data.CompanyName, function(err, result){
			if (err) { 
		        throw err;
	      	}else{
	      		if(result.length >= 1){

	      		}else{
	      			var post  = {
						name: data.CompanyName
					};
	      			var insertQuery = connection.query('INSERT INTO company SET ?', post, function(err2, result2) {
					  	if (err2) { 
					        throw err2;
				      	}else{
				      		var newCompany = new Company(result2.insertId.toString());
							globalCompany.addCompany(newCompany);
							io.sockets.emit('global update companies', globalCompany.allCompany); 
				      	}
					});				
	      		}	      		
	      	}   
		});
		connection.release();
		});		
    });  

    socket.on('global request initial companies', function(data){				
		io.sockets.emit('global update companies', globalCompany.allCompany); 
    });  
	/*============================   Global Function end  =================================*/

	/*============================   Each Company Function Start  =================================*/
    socket.on('join company', function(data){	
    	if(socket.companyId){
    		// leave the current room (stored in session)
			socket.leave(socket.companyId);
    	}		
		// join this room id
		socket.join(data.CompanyId);
		socket.companyId = data.CompanyId;
    });

    socket.on('request reserve seats', function(data){	
    	thisCompany = globalCompany.getCompanyById(socket.companyId);
    	if(thisCompany){
	    	tableConfig = thisCompany.tableConfig;
	    	allCustomers = thisCompany.allCustomers;
	    	callingQueue = thisCompany.callingQueue;

			var customer = _.clone(customer_format);
			customer.Name = data.Name;
			customer.NumberOfSeats = data.NumberOfSeats;
			customer.Id = data.Id;
			customer.SocketId = _.clone(customer_format.SocketId);

			//Add customer into database
			var start = new Date();
			var start_sqlFormat = start.getFullYear() + "-" + (start.getMonth()+1) + "-" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes() + ":" + start.getSeconds();
			var post  = {
				qrcode: data.Id, 
				timestart: start_sqlFormat,		 
				name: data.Name,
				numseat: data.NumberOfSeats
			};
			/*pool.getConnection(function(err, connection){
				var query = connection.query('INSERT INTO reservation SET ?', post, function(err, result) {
				  	if (err) { 
				        throw err;
			      	}
				});
				connection.release();
			});*/

			
			//Add customer in tableConfig
			for(var i =0; i<tableConfig.length; i++){
				if(customer.NumberOfSeats >= tableConfig[i].greater && customer.NumberOfSeats <= tableConfig[i].less){
					//check if this is the first customer in this category
					if(tableConfig[i].customers.length == 0){
						customer.NextQueueFlag = true;
					}
					tableConfig[i].latestQueuePosition = tableConfig[i].latestQueuePosition + 1;
					customer.QueuePosition = tableConfig[i].latestQueuePosition;
					customer.GroupColor = tableConfig[i].groupColor;
					tableConfig[i].customers.push(customer);
					break;
				}
			}

			allCustomers.push(customer);		

	        io.sockets.in(socket.companyId).emit('update table', allCustomers);    
        }
    });  

	socket.on('next queue', function(data){		
		thisCompany = globalCompany.getCompanyById(socket.companyId);
		if(thisCompany){
	    	tableConfig = thisCompany.tableConfig;
	    	allCustomers = thisCompany.allCustomers;
	    	callingQueue = thisCompany.callingQueue;

	    	var foundCustomerInTableConfig = false;
	    	var tableConfigIndex = -1; 
	    	var customersIndex = -1;

	    	var currentQueueCustomer;
	    	var nextFirstQueueCustomer;

			for(var i =0; i<tableConfig.length&& !foundCustomerInTableConfig; i++){
				//find where is next queue call customer in table config 
				for(var j = 0; j<tableConfig[i].customers.length; j++){
					if(data.Id == tableConfig[i].customers[j].Id){
						tableConfigIndex = i;
						customersIndex = j ;
						foundCustomerInTableConfig = true;

						currentQueueCustomer = tableConfig[i].customers[j];
						//Report Error if calling customer is not the first queue in the same catagory group.
						if(customersIndex != 0){
							console.log("---------------- Error: Call Customer that is not the first queue in the same catagory group. ");
						}
						break;
					}
				}
			}

			if(tableConfigIndex != -1){
				//Send out noticifation to all customers in same catagory
				_.each(tableConfig[tableConfigIndex].customers, function(customer, idx) { 
					_.each(customer.SocketId, function(socketId){
						if(socketId){
							io.sockets.socket(socketId).emit("call queue", {'QueueNumber': idx});	
						}
					});		
				 });

				tableConfig[tableConfigIndex].customers.splice(customersIndex, 1); //remove the first queue

				// Find currentQueueCustomer index in allCustomers array
				var customerIndex_InAllCustomers;
				_.each(allCustomers, function(customer, idx) { 
				   if (customer.Id == currentQueueCustomer.Id) {
				      customerIndex_InAllCustomers = idx;
				      return;
				   }
				 });
				//Romove this customers
				allCustomers.splice(customerIndex_InAllCustomers,1);


				if(tableConfig[tableConfigIndex].customers.length > 0){
					//set NextQueueFlag = true for next customer 
					nextFirstQueueCustomer = tableConfig[tableConfigIndex].customers[0];				
					nextFirstQueueCustomer.NextQueueFlag = true;
				}
				
				currentQueueCustomer.NextQueueFlag = false;
				callingQueue.push(currentQueueCustomer);

				//Update end Timestamp for currentQueueCustomer into database
				var end = new Date();
				var end_sqlFormat = end.getFullYear() + "-" + (end.getMonth()+1) + "-" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes() + ":" + end.getSeconds();
				var post  = {
					timeend: end_sqlFormat
				};
				/*pool.getConnection(function(err, connection){
					var query = connection.query('UPDATE reservation SET ? WHERE qrcode = ?', [post, currentQueueCustomer.Id], function(err, result){
						if (err) { 
					        throw err;
				      	}  
					});
					connection.release();
	  			});*/

				//update Table information
				io.sockets.in(socket.companyId).emit('update table', allCustomers); 
				io.sockets.in(socket.companyId).emit('update calling table', callingQueue); 
			}
		}
    });   

	socket.on('customer register code', function(data){	
		if(socket.companyId){
    		// leave the current room (stored in session)
			socket.leave(socket.companyId);
    	}		
    	//Check if data is string or object. If it is String, convert to object
    	if(typeof data === 'string'){  
    		try {
		    	data = JSON.parse(data);
		    } catch (e) {
		    	return;
		    }
    	}
		// join this room id
		socket.join(data.CompanyId);
		socket.companyId = data.CompanyId;
		
		thisCompany = globalCompany.getCompanyById(socket.companyId);
		if(thisCompany){
	    	tableConfig = thisCompany.tableConfig;
	    	allCustomers = thisCompany.allCustomers;
	    	callingQueue = thisCompany.callingQueue;

			//insert socket id for customer in table config
			var foundCustomer = false;
			var thisCustomer = undefined;

			_.each(tableConfig, function(table, tableIdx) { 
				_.each(table.customers,function(customer,customerIdx){
					if(customer.Id == data.Id){
						customer.SocketId.push(data.SocketId);
						foundCustomer = true;
						thisCustomer = _.clone(customer);
						thisCustomer.QueueNumber = customerIdx+1;				
						return;
					}
				});
			});

			if(!foundCustomer){
				//insert socket id for customer in callingQueue
				_.each(callingQueue, function(customer, idx) { 
				   if (customer.Id == data.Id) {
				      customer.SocketId.push(data.SocketId);
				      foundCustomer = true;
				      thisCustomer = _.clone(customer);
				      thisCustomer.QueueNumber = 0;
				      return;
				   }
				});
			}
			if(foundCustomer){
				_.each(thisCustomer.SocketId, function(socketId){
						if(socketId){
							io.sockets.socket(socketId).emit("customer information", thisCustomer);	
						}
				});		

				var post  = {
								doesusemobile: 'true'
							};
				/*pool.getConnection(function(err, connection){
					var query = connection.query('UPDATE reservation SET ? WHERE qrcode = ?', [post, data.Id], function(err, result){
						if (err) { 
					        throw err;
				      	}  
					});
					connection.release();
	  			});*/
			}		
			//update Table information
			io.sockets.in(socket.companyId).emit('update table', allCustomers); 
			io.sockets.in(socket.companyId).emit('update calling table', callingQueue); 
		}
	});

	//Find Customer in Next Queue
	socket.on('request customer in next queue', function(data){
		thisCompany = globalCompany.getCompanyById(socket.companyId);
		if(thisCompany){
	    	tableConfig = thisCompany.tableConfig;
	    	allCustomers = thisCompany.allCustomers;
	    	callingQueue = thisCompany.callingQueue;
			if(data.customerType != undefined && typeof data.customerType === "number"){
				//Current this server have only 0,1,2,3 customer type
				if(data.customerType > 3){
					data.customerType = 3; 
				}
				if(tableConfig[data.customerType].customers.length > 0){
					requestNextCustomer = tableConfig[data.customerType].customers[0];
					io.sockets.in(socket.companyId).emit('respond customer in next queue', requestNextCustomer);
				}else{
					io.sockets.in(socket.companyId).emit('respond customer in next queue', "no more customer waiting in this customer group type");
				}
			}else{
				io.sockets.in(socket.companyId).emit('respond customer in next queue', "require customerType parameter");
			}	
		}		 
	});

	//Customer does attend 
	socket.on('customer attend', function(data){	
		thisCompany = globalCompany.getCompanyById(socket.companyId);
		if(thisCompany){
	    	tableConfig = thisCompany.tableConfig;
	    	allCustomers = thisCompany.allCustomers;
	    	callingQueue = thisCompany.callingQueue;

			// Find data customer index in calling Queue array
			var customerIndex_IncallingQueue;
			_.each(callingQueue, function(customer, idx) { 
			   if (customer.Id == data.Id) {
			      customerIndex_IncallingQueue = idx;
			      return;
			   }
			 });

			var post  = {
					doesattend: "true"
				};
			/*pool.getConnection(function(err, connection){
				var query = connection.query('UPDATE reservation SET ? WHERE qrcode = ?', [post, data.Id], function(err, result){
					if (err) { 
				        throw err;
			      	}  
				});
				connection.release();
			});*/

			//Romove this customers in calling queue
			callingQueue.splice(customerIndex_IncallingQueue,1);

			io.sockets.in(socket.companyId).emit('update table', allCustomers); 
			io.sockets.in(socket.companyId).emit('update calling table', callingQueue); 
		}
	});

	//Customer doesn't attend 
	socket.on('customer does not attend', function(data){	
		thisCompany = globalCompany.getCompanyById(socket.companyId);
		if(thisCompany){
	    	tableConfig = thisCompany.tableConfig;
	    	allCustomers = thisCompany.allCustomers;
	    	callingQueue = thisCompany.callingQueue;

			// Find data customer index in calling Queue array
			var customerIndex_IncallingQueue;
			_.each(callingQueue, function(customer, idx) { 
			   if (customer.Id == data.Id) {
			      customerIndex_IncallingQueue = idx;
			      return;
			   }
			 });

			//Romove this customers in calling queue
			callingQueue.splice(customerIndex_IncallingQueue,1);

			io.sockets.in(socket.companyId).emit('update table', allCustomers); 
			io.sockets.in(socket.companyId).emit('update calling table', callingQueue); 
		}
	});

	//Send Initial Table
	socket.on('request initial table', function(data){	
		thisCompany = globalCompany.getCompanyById(socket.companyId);
		if(thisCompany){
	    	tableConfig = thisCompany.tableConfig;
	    	allCustomers = thisCompany.allCustomers;
	    	callingQueue = thisCompany.callingQueue;
			io.sockets.in(socket.companyId).emit('update table', allCustomers); 
			io.sockets.in(socket.companyId).emit('update calling table', callingQueue); 
		}
	});

	//Test Connection
	socket.on('test connection', function(data){	
		io.sockets.emit('test connection back', data); 
	});


    /*============================   Each Company Function End  =================================*/
});

app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/bower_components'));