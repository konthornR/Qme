var _ = require('underscore');
var agent = require(__dirname+"/pushNotification");

module.exports = function(io,pool) {
	var customer_format = 	{
					'Name': '',
					'NumberOfSeats': 0,
					'Id': '',
					'SocketId': [],
					'PushNotificationToken':[],
					'NextQueueFlag': false,
					'QueuePosition' : 0,
					'GroupColor' : "",
					'TimeStart' : ""
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
	      			var getParameter  = {
							companyid: row.id,
							doesattend: "pending",

					};
	      			var query2 = connection.query('SELECT * FROM reservation WHERE companyid = ? and doesattend = ? ORDER BY timestart ASC',[getParameter.companyid,getParameter.doesattend], function(err2,result2){
	      				if(err2){
	      					throw err2;
	      				}else{
	      					_.each(result2,function(row2){
	      						var customer = _.clone(customer_format);
								customer.Name = row2.name;
								customer.NumberOfSeats = row2.numseat;
								customer.Id = row2.qrcode;
								customer.SocketId = _.clone(customer_format.SocketId);
								customer.PushNotificationToken = _.clone(customer_format.PushNotificationToken);

								// Must add customer.timestart From sql timestart

	      						if(row2.timeend){	      							
	      							newCompany.allCustomers.push(customer);
	      							newCompany.callingQueue.push(customer);
	      						}else{
	      							_.each(newCompany.tableConfig,function(table){
	      								if(row2.numseat >= table.greater && row2.numseat <= table.less){
											if(table.customers.length == 0){
												customer.NextQueueFlag = true;
											}
											table.latestQueuePosition = table.latestQueuePosition + 1;
											//customer.QueuePosition = table.latestQueuePosition;
											customer.QueuePosition = table.customers.length + 1; 
											customer.GroupColor = table.groupColor;
											table.customers.push(customer);
											newCompany.allCustomers.push(customer);
	      								}
	      							});
	      						}
	      					});
	      				}
	      			});
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
					io.sockets.emit('database connection error', 'database connection error'); 
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
	    	if(thisCompany && parseInt(data.NumberOfSeats) > 0){
		    	tableConfig = thisCompany.tableConfig;
		    	allCustomers = thisCompany.allCustomers;
		    	callingQueue = thisCompany.callingQueue;

				var customer = _.clone(customer_format);
				customer.Name = data.Name;
				customer.NumberOfSeats = data.NumberOfSeats;
				customer.Id = data.Id;
				customer.SocketId = _.clone(customer_format.SocketId);
				customer.PushNotificationToken = _.clone(customer_format.PushNotificationToken);

				//Add customer into database
				var start = new Date();
				customer.TimeStart = start;
				var start_sqlFormat = start.getFullYear() + "-" + (start.getMonth()+1) + "-" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes() + ":" + start.getSeconds();
				var post  = {
					companyid: parseInt(socket.companyId),
					qrcode: data.Id, 
					timestart: start_sqlFormat,		 
					name: data.Name,
					numseat: data.NumberOfSeats
				};
				pool.getConnection(function(err, connection){
					if(err){
						connection.release();
						console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
						io.sockets.emit('database connection error', 'database connection error'); 
						return;
					}
					var query = connection.query('INSERT INTO reservation SET ?', post, function(err, result) {
					  	if (err) { 
					        throw err;
				      	}
					});
					connection.release();
				});

				
				//Add customer in tableConfig
				for(var i =0; i<tableConfig.length; i++){
					if(customer.NumberOfSeats >= tableConfig[i].greater && customer.NumberOfSeats <= tableConfig[i].less){
						//check if this is the first customer in this category
						if(tableConfig[i].customers.length == 0){
							customer.NextQueueFlag = true;
						}
						tableConfig[i].latestQueuePosition = tableConfig[i].latestQueuePosition + 1;
						//customer.QueuePosition = tableConfig[i].latestQueuePosition;
						customer.QueuePosition = tableConfig[i].customers.length + 1; 
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
						customer.QueuePosition = idx; 
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
					//allCustomers.splice(customerIndex_InAllCustomers,1);


					if(tableConfig[tableConfigIndex].customers.length > 0){
						//set NextQueueFlag = true for next customer 
						nextFirstQueueCustomer = tableConfig[tableConfigIndex].customers[0];				
						nextFirstQueueCustomer.NextQueueFlag = true;
						//Send Push Notification to nextFirstQueueCustomer
						_.each(nextFirstQueueCustomer.PushNotificationToken, function(token){
							if(token){
								agent.createMessage()
								    .device(token)
								    .alert("Next queue is your queue")
								    .sound("Queue.aiff")
								    .send(function (err) {
								      // handle apnagent custom errors
								      if (err && err.toJSON) {
								        console.log("Push Notification JSON Error!!");
								      }
								      // handle anything else (not likely)
								      else if (err) {
								        console.log("Push Notification Error!!");
								      }
								      // it was a success
								      else {
								        //console.log("Success");
								      }
								    });		
							}
						});	
					}
					
					currentQueueCustomer.NextQueueFlag = false;
					currentQueueCustomer.QueuePosition = 0;
					callingQueue.push(currentQueueCustomer);					

					//Update end Timestamp for currentQueueCustomer into database
					var end = new Date();
					var end_sqlFormat = end.getFullYear() + "-" + (end.getMonth()+1) + "-" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes() + ":" + end.getSeconds();
					var post  = {
						timeend: end_sqlFormat
					};
					pool.getConnection(function(err, connection){
						if(err){
							connection.release();
							console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
							io.sockets.emit('database connection error', 'database connection error'); 
							return;
						}
						var query = connection.query('UPDATE reservation SET ? WHERE companyid = ? and qrcode = ?', [post, parseInt(socket.companyId),currentQueueCustomer.Id], function(err, result){
							if (err) { 
						        throw err;
					      	}else
					      		console.log(result);  
						});
						connection.release();
		  			});

					//update Table information
					io.sockets.in(socket.companyId).emit('update table', allCustomers); 
					io.sockets.in(socket.companyId).emit('update calling table', callingQueue); 
				}
			}
	    });   

		socket.on('request cancel queue', function(data){	
		 	//Check if data is string or object. If it is String, convert to object
	    	if(typeof data === 'string'){  
	    		try {
			    	data = JSON.parse(data);
			    } catch (e) {
			    	return;
			    }
	    	}
			thisCompany = globalCompany.getCompanyById(socket.companyId);
			if(thisCompany){
		    	tableConfig = thisCompany.tableConfig;
		    	allCustomers = thisCompany.allCustomers;
		    	callingQueue = thisCompany.callingQueue;

		    	var foundCustomerInTableConfig = false;
		    	var tableConfigIndex = -1; 
		    	var customersIndex = -1;

		    	var cancelQueueCustomer;
		    	var nextFirstQueueCustomer;

				for(var i =0; i<tableConfig.length&& !foundCustomerInTableConfig; i++){
					//find where is next queue call customer in table config 
					for(var j = 0; j<tableConfig[i].customers.length; j++){
						if(data.Id == tableConfig[i].customers[j].Id){
							tableConfigIndex = i;
							customersIndex = j ;
							foundCustomerInTableConfig = true;

							cancelQueueCustomer = tableConfig[i].customers[j];							
							break;
						}
					}
				}

				if(tableConfigIndex != -1){
					
					tableConfig[tableConfigIndex].customers.splice(customersIndex, 1); //remove the first queue
					//Send out noticifation to all customers in same catagory
					_.each(tableConfig[tableConfigIndex].customers, function(customer, idx) { 
						_.each(customer.SocketId, function(socketId){
							if(socketId){
								io.sockets.socket(socketId).emit("call queue", {'QueueNumber': idx+1});	
							}
						});		
					 });

					// Find cancelQueueCustomer index in allCustomers array
					var customerIndex_InAllCustomers = -1;
					_.each(allCustomers, function(customer, idx) { 
					   if (customer.Id == cancelQueueCustomer.Id) {
					      customerIndex_InAllCustomers = idx;
					      return;
					   }
					 });
					if(customerIndex_InAllCustomers != -1){							
						//Romove this customers
						allCustomers.splice(customerIndex_InAllCustomers,1);
					}


					if(customersIndex == 0 && tableConfig[tableConfigIndex].customers.length > 0){
						//set NextQueueFlag = true for next customer 
						nextFirstQueueCustomer = tableConfig[tableConfigIndex].customers[0];				
						nextFirstQueueCustomer.NextQueueFlag = true;

						//Send Push Notification to nextFirstQueueCustomer
						_.each(nextFirstQueueCustomer.PushNotificationToken, function(token){
							if(token){
								agent.createMessage()
								    .device(token)
								    .alert("Next queue is your queue")
								    .sound("Queue.aiff")
								    .send(function (err) {
								      // handle apnagent custom errors
								      if (err && err.toJSON) {
								        console.log("Push Notification JSON Error!!");
								      }
								      // handle anything else (not likely)
								      else if (err) {
								        console.log("Push Notification Error!!");
								      }
								      // it was a success
								      else {
								        //console.log("Success");
								      }
								    });		
							}
						});	
					}
				}else{
					// Find cancelQueueCustomer index in allCustomers array
					var customerIndex_InCallingQueue = -1;
					_.each(callingQueue, function(customer, idx) { 
						if (customer.Id == data.Id) {
							cancelQueueCustomer = customer;
					    	customerIndex_InCallingQueue = idx;
							return;
					   }
					});
					if(customerIndex_InCallingQueue != -1){
						//Romove this customers
						callingQueue.splice(customerIndex_InCallingQueue,1);
					}
				}	
				if(cancelQueueCustomer){					
					//Update does not attend for cancelQueueCustomer into database
					var post  = {
						doesattend: "false"
					};
					pool.getConnection(function(err, connection){
						if(err){
							connection.release();
							console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
							io.sockets.emit('database connection error', 'database connection error'); 
							return;
						}
						var query = connection.query('UPDATE reservation SET ? WHERE companyid = ? and qrcode = ?', [post, parseInt(socket.companyId),cancelQueueCustomer.Id], function(err, result){
							if (err) { 
						        throw err;
					      	}  
						});
						connection.release();
		  			});

		  			//Send cancel confirmation 
		  			_.each(cancelQueueCustomer.SocketId, function(socketId){
						if(socketId){
							io.sockets.socket(socketId).emit("cancel queue confirm", {'CancelQueue': true});	
						}
					});

				}
				//update Table information
				io.sockets.in(socket.companyId).emit('update table', allCustomers); 
				io.sockets.in(socket.companyId).emit('update calling table', callingQueue); 
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
							if(data.PushNotificationToken){
								customer.PushNotificationToken.push(data.PushNotificationToken);
							}
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
					    	if(data.PushNotificationToken){
								customer.PushNotificationToken.push(data.PushNotificationToken);
							}	
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
					pool.getConnection(function(err, connection){
						if(err){
							connection.release();
							console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
							io.sockets.emit('database connection error', 'database connection error'); 
							return;
						}
						var query = connection.query('UPDATE reservation SET ? WHERE companyid = ? and qrcode = ?', [post, parseInt(socket.companyId),data.Id], function(err, result){
							if (err) { 
						        throw err;
					      	}  
						});
						connection.release();
		  			});
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
				var customerIndex_IncallingQueue = -1;
				_.each(callingQueue, function(customer, idx) { 
				   if (customer.Id == data.Id) {
				      customerIndex_IncallingQueue = idx;
				      return;
				   }
				 });
				if(customerIndex_IncallingQueue != -1){
					var post  = {
							doesattend: "true"
						};
					pool.getConnection(function(err, connection){
						if(err){
							connection.release();
							console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
							io.sockets.emit('database connection error', 'database connection error'); 
							return;
						}
						var query = connection.query('UPDATE reservation SET ? WHERE companyid = ? and qrcode = ?', [post, parseInt(socket.companyId), data.Id], function(err, result){
							if (err) { 
						        throw err;
					      	}  
						});
						connection.release();
					});
					// Find currentQueueCustomer index in allCustomers array
					var customerIndex_InAllCustomers = -1;
					_.each(allCustomers, function(customer, idx) { 
					   if (customer.Id == data.Id) {
					      customerIndex_InAllCustomers = idx;
					      return;
					   }
					 });
					if(customerIndex_InAllCustomers != -1){							
						//Romove this customers
						allCustomers.splice(customerIndex_InAllCustomers,1);	
					}

					//Romove this customers in calling queue
					callingQueue.splice(customerIndex_IncallingQueue,1);
				}

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
				var customerIndex_IncallingQueue = -1;
				_.each(callingQueue, function(customer, idx) { 
				   if (customer.Id == data.Id) {
				      customerIndex_IncallingQueue = idx;
				      return;
				   }
				 });

				
				if(customerIndex_IncallingQueue != -1){

					var post  = {
						doesattend: "false"
					};
					pool.getConnection(function(err, connection){
						if(err){
							connection.release();
							console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
							io.sockets.emit('database connection error', 'database connection error'); 
							return;
						}
						var query = connection.query('UPDATE reservation SET ? WHERE companyid = ? and qrcode = ?', [post, parseInt(socket.companyId), data.Id], function(err, result){
							if (err) { 
						        throw err;
					      	}  
						});
						connection.release();
					});				
					// Find currentQueueCustomer index in allCustomers array
					var customerIndex_InAllCustomers = -1;
					_.each(allCustomers, function(customer, idx) { 
					   if (customer.Id == data.Id) {
					      customerIndex_InAllCustomers = idx;
					      return;
					   }
					 });
					if(customerIndex_InAllCustomers != -1){							
						//Romove this customers
						allCustomers.splice(customerIndex_InAllCustomers,1);
					}							
					//Romove this customers in calling queue
					callingQueue.splice(customerIndex_IncallingQueue,1);
				}

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

		socket.on('request customer search by name and id', function(data){
			thisCompany = globalCompany.getCompanyById(socket.companyId);
			if(thisCompany && data.Name && data.NumberOfSeats){
		    	tableConfig = thisCompany.tableConfig;
		    	allCustomers = thisCompany.allCustomers;
		    	callingQueue = thisCompany.callingQueue;

		    	var searchResult = [];
				_.each(allCustomers,function(customer){
					if(customer.Name == data.Name && customer.NumberOfSeats == data.NumberOfSeats){
						searchResult.push(customer);
					}
				});
				_.each(callingQueue,function(customer){
					if(customer.Name == data.Name && customer.NumberOfSeats == data.NumberOfSeats){
						searchResult.push(customer);
					}
				});
				io.sockets.in(socket.companyId).emit('respond customer search by name and id', searchResult); 
		    }
		});

		//Test Connection
		socket.on('test connection', function(data){	
			io.sockets.emit('test connection back', data); 
		});


	    /*============================   Each Company Function End  =================================*/
	});
};

module.exports.getCompaniesByUserId = function (req, res, pool) {

    var companies = [];

    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
            return;
        }
        var query = connection.query('SELECT * FROM company WHERE id in (SELECT companyid FROM userownshop WHERE userid = ?)', [req.user.id], function (err, result) {
            if (err) {
                throw err;
            } else {
                _.each(result, function (row) {
                    companies.push({
                        id: row.id,
                        name: row.name
                    });
                });
            }
            return res.send(companies);
        });
        connection.release();
        
    });
};