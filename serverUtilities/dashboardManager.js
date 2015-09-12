var _ = require('underscore');

module.exports = {
	queryByDashboardSectionOne: function (req,res,pool) {
		var requestCompanyId = req.body.CompanyId;
		var dateFrom = req.body.TimeStart;
		var dateTo = req.body.TimeEnd;
		dateTo = dateTo+" :23:59:59"

		pool.getConnection(function(err, connection){
			if(err){
				connection.release();
				console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
		      	res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}
			var query = connection.query('SELECT * FROM reservation WHERE companyId = ? and timestart >= ? and timestart <= ?', [requestCompanyId,dateFrom,dateTo], function(err, result){
				if (err) { 
			        throw err;
		      	}else{
					var groupByHour = _.chain(result)
								      	.groupBy(function (entity) {
								            return entity.timestart.getHours();
										}).value();
					var groupOfGroupByHour = [
												{
													groupHours: [8,9],
													numCount: 0
												},
												{
													groupHours: [10,11],
													numCount: 0
												},
												{
													groupHours: [12,13],
													numCount: 0
												},
												{
													groupHours: [14,15],
													numCount: 0
												},
												{
													groupHours: [16,17],
													numCount: 0
												},
												{
													groupHours: [18,19],
													numCount: 0
												},
												{
													groupHours: [20,21],
													numCount: 0
												},
												{
													groupHours: [22,23],
													numCount: 0
												}
											];					

					_.each(_.keys(groupByHour), function(key){
						_.each(groupOfGroupByHour,function(x){
							_.each(x.groupHours,function(hour){
								if(parseInt(key) == hour){
									x.numCount = x.numCount + groupByHour[key].length;
								}
							});
						});
					});
					
					var chart01 = {
						"dataProvider": [
								            {
								                "category": "8.00 - 10.00",
								                "column-1": groupOfGroupByHour[0]["numCount"]
								            },
								            {
								                "category": "10.00 - 12.00",
								                "column-1": groupOfGroupByHour[1]["numCount"]
								            },
								            {
								                "category": "12.00 - 14.00",
								                "column-1": groupOfGroupByHour[2]["numCount"]
								            },
								            {
								                "category": "14.00 - 16.00",
								                "column-1": groupOfGroupByHour[3]["numCount"]
								            },
								            {
								                "category": "16.00 - 18.00",
								                "column-1": groupOfGroupByHour[4]["numCount"]
								            },
								            {
								                "category": "18.00 - 20.00",
								                "column-1": groupOfGroupByHour[5]["numCount"]
								            },
								            {
								                "category": "20.00 - 22.00",
								                "column-1": groupOfGroupByHour[6]["numCount"]
								            }
								        ]
					};
		      		var groupByNumSeat = _.chain(result)
								      .groupBy(function (entity) {
								            return entity.numseat;
								      }).value()

		      		var chart02 = {
		      			"dataProvider":[{
		      				"category": "",
		      				"1 Chairs": 0,
			                "2 Chairs": 0,
			                "3 Chairs": 0,
			                "4 Chairs": 0,
			                "5 Chairs": 0,
			                "6 Chairs": 0,
			                "7 Chairs": 0,
			                "8 Chairs": 0,
			                "9 Chairs": 0,
		      			}]
		      		};
		      		_.each(_.keys(groupByNumSeat), function(key){
						if(parseInt(key) <= 8){
							chart02["dataProvider"][0][key+" Chairs"] = groupByNumSeat[key].length;
						}else
							chart02["dataProvider"][0]["9 Chairs"] = chart02["dataProvider"][0]["9 Chairs"] + groupByNumSeat[key].length;
					});
		      		var groupByDay = _.chain(result)
								      .groupBy(function (entity) {
								            return entity.timestart.getDay();
								      }).value();
		      		var chart03 = {
		      			"dataProvider": [
				            {
				                "category": "อาทิตย์",
				                "column-1": 0
				            },
				            {
				                "category": "จันทร์",
				                "column-1": 0
				            },
				            {
				                "category": "อังคาร",
				                "column-1": 0
				            },
				            {
				                "category": "พุธ",
				                "column-1": 0

				            },
				            {
				                "category": "พฤหัสบดี",
				                "column-1": 0
				            },
				            {
				                "category": "ศุกร์",
				                "column-1": 0
				            },
				            {
				                "category": "เสาร์",
				                "column-1": 0
				            }
		        		]
		      		};
		      		_.each(_.keys(groupByDay), function(key){
						if(parseInt(key) >=0){
							chart03["dataProvider"][parseInt(key)]["column-1"] = groupByDay[key].length;
						}
					});
		      		return res.send([chart01,chart02,chart03]);
		      	}   
			});
			connection.release();
		});
	},
	queryByDashboardSectionTwo: function (req,res,pool) {
		var requestCompanyId = req.body.CompanyId;
		pool.getConnection(function(err, connection){
			if(err){
				connection.release();
				console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
		      	res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}
			var queryDateObject = new Date(); 
			queryDateObject.setHours(0,0,0,0);
			queryDateObject.setDate(1);
			queryDateObject.setMonth(queryDateObject.getMonth() - 12);
			var query = connection.query('SELECT * FROM reservation WHERE companyId = ? and timestart >= ?', [requestCompanyId,queryDateObject], function(err, result){
				if (err) { 
			        throw err;
		      	}else{
		      		var filterCurrentInQueueUsers = _.filter(result,function(x){
		      			return x.doesattend == "pending";
		      		});
		      		var numCurrentInQueueUsers = filterCurrentInQueueUsers.length;
		      		var sumCount = 0;
		      		var chart05 = {
		      			"dataProvider" : []
		      		}
		      		var chart06 = {
		      			"dataProvider" : []
		      		}
		      		for(var num = -30; num<=0; num++){
		      			var dateObject = new Date(); 
		      			dateObject.setDate(dateObject.getDate() + num);
		      			var numCountAttendPastDate = 0;
		      			var numCountNotAttendPastDate = 0;
		      			var numCountUseApp = 0;
		      			var numCountNotUseApp = 0

		      			var queryPastDate = _.filter(result,function(x){
		      				return x.timestart.getYear() == dateObject.getYear() && x.timestart.getMonth() == dateObject.getMonth() && x.timestart.getDate() == dateObject.getDate();
		      			});
		      			numCountAttendPastDate = _.filter(queryPastDate,function(x){
		      				return x.doesattend == "true"
		      			}).length;
		      			numCountNotAttendPastDate = _.filter(queryPastDate,function(x){
		      				return x.doesattend == "false"
		      			}).length;
		      			numCountUseApp = _.filter(queryPastDate,function(x){
		      				return x.doesusemobile == "true"
		      			}).length;
		      			numCountNotUseApp = _.filter(queryPastDate,function(x){
		      				return x.doesusemobile == "false"
		      			}).length;


		      			var dataPointObjectForAttended = {
		      				"date" : dateObject,
							"column-1": numCountAttendPastDate,
							"column-2": numCountNotAttendPastDate
		      			};
		      			chart05["dataProvider"].push(dataPointObjectForAttended);
		      			var dataPointObjectForUseMobile = {
		      				"date" : dateObject,
							"column-1": numCountUseApp,
							"column-2": numCountNotUseApp
		      			};
		      			sumCount = sumCount + numCountUseApp + numCountNotUseApp;
		      			chart06["dataProvider"].push(dataPointObjectForUseMobile);
		      		}

		      		var chart07 = {
		      			"dataProvider" : []
		      		}
		      		var chart08 = {
		      			"dataProvider" : []
		      		}
		      		for(var num = -12; num<=0; num++){
		      			var dateObject = new Date(); 
		      			dateObject.setHours(0,0,0,0);
						dateObject.setDate(1);
		      			dateObject.setMonth(dateObject.getMonth() + num);
		      			var numCountAttendPastMonth = 0;
		      			var numCountNotAttendPastMonth = 0;
		      			var numCountUseApp = 0;
		      			var numCountNotUseApp = 0

		      			var queryPastMonth = _.filter(result,function(x){
		      				return x.timestart.getYear() == dateObject.getYear() && x.timestart.getMonth() == dateObject.getMonth();
		      			});
		      			numCountAttendPastMonth = _.filter(queryPastMonth,function(x){
		      				return x.doesattend == "true"
		      			}).length;
		      			numCountNotAttendPastMonth = _.filter(queryPastMonth,function(x){
		      				return x.doesattend == "false"
		      			}).length;
		      			numCountUseApp = _.filter(queryPastMonth,function(x){
		      				return x.doesusemobile == "true"
		      			}).length;
		      			numCountNotUseApp = _.filter(queryPastMonth,function(x){
		      				return x.doesusemobile == "false"
		      			}).length;


		      			var dataPointObjectForAttended = {
		      				"date" : dateObject.getFullYear()+"-"+(dateObject.getMonth()+1),
							"column-1": numCountAttendPastMonth,
							"column-2": numCountNotAttendPastMonth
		      			};
		      			chart07["dataProvider"].push(dataPointObjectForAttended);
		      			var dataPointObjectForUseMobile = {
		      				"date" : dateObject.getFullYear()+"-"+(dateObject.getMonth()+1),
							"column-1": numCountUseApp,
							"column-2": numCountNotUseApp
		      			};
		      			chart08["dataProvider"].push(dataPointObjectForUseMobile);

		      		}

		      		return res.send([numCurrentInQueueUsers,chart05,chart06,chart07,chart08]);
		      	}   
			});
			connection.release();
		});
	}
};



/*=================== Get data for presenting on Dashboard End ===================*/
