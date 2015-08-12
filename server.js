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
    	res.sendfile(path.join(__dirname, '/views/foreground/queueList.html'));
    else
    	res.sendfile(__dirname + '/public/index.html');  
});

app.get('/ReserveQueue', function (req, res) {
	if(allowAccess(req))
  		res.sendfile(path.join(__dirname, '/views/foreground/reservequeue.html'));
  	else
    	res.sendfile(__dirname + '/public/index.html');
});

app.get('/CallQueue', function (req, res) {
  	if(allowAccess(req))
  		res.sendfile(path.join(__dirname, '/views/foreground/callqueue.html'));
  	else
    	res.sendfile(__dirname + '/public/index.html');
});

app.get('/admin/CreateOrJoinCompany', function (req, res) {
  	res.sendfile(path.join(__dirname, '/views/admin/createOrJoinCompany.html'));
});

app.get('/admin/SignUp', function (req, res) {
  	res.sendfile(path.join(__dirname, '/views/admin/signup.html'));
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
						password: passwordEncryption.encrypt(req.body.password)
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
require(__dirname+"/serverUtilities/queueManager")(io,pool);


app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/bower_components'));