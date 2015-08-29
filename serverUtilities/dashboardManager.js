/*=================== Get data for presenting on Dashboard Start ===================*/
app.post('/dashboard', function(req,res){
	var requestCompanyId = req.body.companyId;
	if(allowAccessForDataShowOnDashboard(req)){
		pool.getConnection(function(err, connection){
			if(err){
				connection.release();
				console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
	          	res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}
			var query = connection.query('SELECT * FROM reservation WHERE companyId = ?', requestCompanyId, function(err, result){
				if (err) { 
			        throw err;
		      	}else{
		      			      		
		      	}   
			});
			connection.release();
		});
	}
});

var requestCompanyId = 52;
pool.getConnection(function(err, connection){
	if(err){
		connection.release();
		console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
      	res.json({"code" : 100, "status" : "Error in connection database"});
		return;
	}
	var query = connection.query('SELECT * FROM reservation WHERE companyId = ?', requestCompanyId, function(err, result){
		if (err) { 
	        throw err;
      	}else{
      		/*console.log(_.chain(result)
					      .groupBy(function (entity) {
					            return entity.numseat;
					      })/*.map(function(value,key){
					      		return {
					      			numSeat : key,
					      			count : value.length
					      		}
					      }).value()
					    );	*/
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
				if(parseInt(key) <= 1){
					chart02["dataProvider"][0][key+" Chairs"] = groupByNumSeat[key].length;
				}else
					chart02["dataProvider"][0]["9 Chairs"] = chart02["dataProvider"][0]["9 Chairs"] + groupByNumSeat[key].length;
			});
      		//console.log(chart02);
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
			console.log(_.chain(result)
						      .groupBy(function (entity) {
						            return entity.timestart.getHours();
						}).value());
      		
      	}   
	});
	connection.release();
});

/*=================== Get data for presenting on Dashboard End ===================*/