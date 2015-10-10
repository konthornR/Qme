var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);

var url  = require('url');
var _ = require('underscore');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var passport = require('passport');
var passportLocal = require('passport-local');

app.set('view engine', 'jade');
app.locals.basedir = path.join(__dirname, 'views');

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

var passwordEncryption = require(__dirname+"/serverUtilities/passwordEncryption");
var queryDashboard = require(__dirname + "/serverUtilities/dashboardManager");
var queryQueue = require(__dirname + "/serverUtilities/queueManager");

/*============================== Function Check Allow Access Start ===========================*/
var allowAccessToQueueManager = function(req){
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

var allowAccess = function(req){	
	return req.isAuthenticated();
}

var allowAccessForDataShowOnDashboard = function(req){
	var requestCompanyId = req.body.CompanyId;
    var result = false;
	if(req.isAuthenticated() && req.user && req.user.companyIdList && req.user.role == 'owner'){
		_.each(req.user.companyIdList, function(companyId){
			if(companyId.toString() === requestCompanyId.toString()){
				result = true;
			}
		});	
	}    
    return result;
}
/*============================== Function Check Allow Access End ===========================*/
app.get('/', function (req, res) {
  res.render(path.join(__dirname, '/views/home.jade'));
});


app.get('/LogIn', function(req,res){
	res.render(path.join(__dirname, '/views/account/login.jade'));
});

app.get('/account/index', function (req, res) {
    if (allowAccess(req))
        res.render(path.join(__dirname, '/views/account/index.jade'), { mainCtrl: 'backstoreControl', isOwner: req.user.role == 'owner' });
    else
    	res.redirect('/');
});

app.get('/backstore/dashboard', function (req, res) {
    if (allowAccess(req))
        res.render(path.join(__dirname, '/views/backstore/dashboard.jade'), { mainCtrl: 'backstoreControl' });
    else
        res.redirect('/');
});

app.get('/QueueLists', function (req, res) {
    if(allowAccessToQueueManager(req))
    	res.render(path.join(__dirname, '/views/foreground/queuelist.jade'), { mainCtrl: 'tableQueueControl' });
    else
    	res.redirect('/'); 
});

app.get('/CallQueue', function (req, res) {
    if (allowAccessToQueueManager(req))
        res.render(path.join(__dirname, '/views/foreground/callqueue.jade'), { mainCtrl: 'tableQueueControl' });
    else
        res.redirect('/');
});

app.get('/ReserveQueue', function (req, res) {
	if(allowAccessToQueueManager(req))
  		res.render(path.join(__dirname, '/views/foreground/reservequeue.jade'), { mainCtrl: 'reserveQueueControl' });
  	else
  		res.redirect('/');
});

app.get('/admin/CreateOrJoinCompany', function (req, res) {
  	res.sendfile(path.join(__dirname, '/views/admin/createOrJoinCompany.html'));
});

app.get('/admin/SignUp', function (req, res) {
  	res.sendfile(path.join(__dirname, '/views/admin/signup.html'));
});
app.get('/admin/UserAndCompanyManager', function (req, res) {
  	res.sendfile(path.join(__dirname, '/views/admin/userAndCompanyManager.html'));
});

//for angular to see jade file
app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
});

var pool = require("./serverUtilities/databaseManager");

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
			console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
			done(null,null); 
			return;
		}
		var query = connection.query('SELECT * FROM user WHERE username = ?', username, function(err, result){
			if (err) { 
		        //throw err;
	      	}else{
	      		if(result.length==1){
	      			if(password === passwordEncryption.decrypt(result[0].password)){
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
		var role = '';
		if(err){
			console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
			done(null,{ id: id, companyIdList: companyIdList, role: role})
			return;
		}
		var query2 = connection.query('SELECT * FROM userownshop WHERE userid = ?', id, function(err2, result2){
			if(err2){
				//throw err2;
			}else{
				if(result2.length>0){
					_.each(result2, function(row){
						companyIdList.push(row.companyid);
					});	
				}
      		}
      		var query = connection.query('SELECT * FROM user WHERE id = ?', id, function(err, result){
				if(err){
					//throw err;
				}else{

					if(result.length == 1){
						role = result[0].role;
					}
				}
				done(null,{ id: id, companyIdList: companyIdList, role: role})
			}); 		
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

/*============================== Admin Session Start ===========================*/
app.post('/admin/signup', function(req,res){
	var newUsername = req.body.username;
	pool.getConnection(function(err, connection){
		if(err){
			console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
          	res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		}
		var query = connection.query('SELECT * FROM user WHERE username = ?', newUsername, function(err, result){
			if (err) { 
		        //throw err;
	      	}else{
	      		if(result.length >= 1){
	      			res.send(401, 'string');	      			
	      		}else{
	      			var post  = {
						username: newUsername, 
						password: passwordEncryption.encrypt(req.body.password),
						role: 'owner'
					};
	      			var insertQuery = connection.query('INSERT INTO user SET ?', post, function(err2, result2) {
					  	if (err2) { 
					        //throw err2;
				      	}
					});				
	      		}	      		
	      	}   
		});
		connection.release();
	});
	
});
app.post('/admin/listUser',function(req,res){
	pool.getConnection(function(err, connection){
		if(err){
			console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		}
		var query = connection.query('SELECT * FROM user', function(err, result){
			if (err) { 
		        //throw err;
	      	}else{
	      		res.send(result);				      		
	      	}   
		});
		connection.release();
	});
});
app.post('/admin/listCompany',function(req,res){
	pool.getConnection(function(err, connection){
		if(err){
			console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		}
		var query = connection.query('SELECT * FROM company', function(err, result){
			if (err) { 
		        //throw err;
	      	}else{
	      		res.send(result);	      		
	      	}   
		});
		connection.release();
	});
});
app.post('/admin/listLink',function(req,res){
	pool.getConnection(function(err, connection){
		if(err){
			console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		}
		var query = connection.query('SELECT * FROM userownshop', function(err, result){
			if (err) { 
		        //throw err;
	      	}else{
	      		res.send(result);		      		
	      	}   
		});
		connection.release();
	});
});
app.post('/admin/linkUserCompany',function(req,res){
	var userId = req.body.userId;
	var companyId = req.body.companyId;
	if(userId && parseInt(userId) && companyId && parseInt(companyId)){
		pool.getConnection(function(err, connection){
			if(err){
				console.log("!!!!!!!!!!!!!!!!!!!!!! Can not connect with database !!!!!!!!!!!!!!!!!!!!!");
				res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}
			var post  = {
							userid: userId, 
							companyid: companyId
						};
			var insertQuery = connection.query('INSERT INTO userownshop SET ?', post, function(err2, result2) {
			  	if (err2) { 
			  		//throw err2
			        console.log(err2);
		      	}
			});	
			connection.release();
		});
	}else{
		res.json({"code" : 100, "status" : "Fail for this request"});
	}
});
/*============================== Admin Session End ===========================*/
/*=================== Get data for presenting on Dashboard Start ===================*/
app.post('/dashboardSectionOne', function(req,res){
	if(allowAccessForDataShowOnDashboard(req)){
		queryDashboard.queryByDashboardSectionOne(req,res,pool);
	}else
		res.send(401, 'string');	
});
app.post('/dashboardSectionTwo', function(req,res){
	if(allowAccessForDataShowOnDashboard(req)){
		queryDashboard.queryByDashboardSectionTwo(req,res,pool);
	}else
		res.send(401, 'string');	
});
/*=================== Get data for presenting on Dashboard Start ===================*/

require(__dirname+"/serverUtilities/queueManager")(io,pool);


app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/bower_components'));



/*=================== API ===================*/

app.post('/api/getCompaniesByUserId', function (req, res) {
    if (allowAccess(req)) {
        return queryQueue.getCompaniesByUserId(req, res, pool);
    } else {
        res.send(401, 'Not authorized');
    }
});

/*=================== For Partial ===================*/
app.get('/partials/company-dropdown', function (req, res) {
    if (allowAccess(req)) {
        res.sendfile(path.join(__dirname, '/views/partials/company-dropdown.html'));
    } else {
        res.send(401, 'Not authorized');
    }
});

