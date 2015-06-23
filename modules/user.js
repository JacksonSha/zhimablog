var db = require('./db');

function User() {
	this.id=null;
	this.username=null;
	this.nickname=null;
	this.email=null;
	this.password=null;
	//console.log(arguments[0].constructor);
	if(arguments.length==1){
		user = arguments[0];
		this.id = (user&&user.USR_ID) || null;
		this.username = (user&&user.USR_LOGIN) || null;
		this.nickname = (user&&user.USR_NICKNAME) || null;
		this.email = (user&&user.USR_EMAIL) || null;
		this.password = (user&&user.USR_PASSWORD) || null;
	}
	if(arguments.length==4){
		this.username = arguments[0];
		this.nickname = arguments[1];
		this.email = arguments[2];
		this.password = arguments[3];
	}
	if(arguments.length==5 && arguments[0].constructor===Number){
		this.id = arguments[0];
		this.username = arguments[1];
		this.nickname = arguments[2];
		this.email = arguments[3];
		this.password = arguments[4];
	}
};
module.exports = User;

function connectUtil(err, connection, sql, params, callback) {
    if(err){
	  connection.release();
	  callback(err);
	  return;
    }
    console.log('connected as id ' + connection.threadId);
    connection.query(sql, params, function(err, rows){
        if(!err) {
          connection.release();
          callback(err, rows);
        } else {
  		  connection.release();
		  callback(err);
		  return;
        }
    });
    connection.on('error', function(err) {
	  connection.release();
	  callback(err);
	  return;
    });
};

User.prototype.save = function (callback) {
	var user = this;
	db.getConnection(function(err, connection){
	    var sql = 'INSERT INTO z_user '
	    	+'(USR_LOGIN,USR_NICKNAME,USR_EMAIL,USR_PASSWORD,USR_REGISTER_DT) '
	    	+'VALUES (?,?,?,?,now()) ';
	    var params = [user.username, user.nickname, user.email, user.password];
		connectUtil(err, connection, sql, params, function(err, res){
			callback(err, res.insertId);
		});
	});
};

User.prototype.login = function (callback) {
	var user = this;
	db.getConnection(function(err, connection){
	    if(err){
		  connection.release();
		  callback(err);
		  return;
	    }
	    console.log('connected as id ' + connection.threadId);
	    var sql = 'SELECT a.* FROM z_user a WHERE USR_LOGIN=? AND USR_PASSWORD=? ';
	    var params = [user.username, user.password];
	    connectUtil(err, connection, sql, params, function(err, res){
			callback(err, res.insertId);
		});
	});
};

User.getByUsername = function (username, callback) {
	db.getConnection(function(err, connection){
	    console.log('connected as id ' + connection.threadId);
	    var sql = 'SELECT a.* FROM z_user a WHERE USR_LOGIN=? ';
	    connectUtil(err, connection, sql, [username], function(err, rows){
	    	if(err){
	    		callback(err);
	    	} else if(rows.length==0) {
	    		callback(err);
	    	} else {
	    		callback(err, new User(rows[0]));
	    	}
		});
	});
};


//User.getByUsername('jacsha',function(err,user){
//	console.log(err,user);
//});

//var u = new User('jack','十年','jazhou@acxiom.com','jazhou');
//u.save(function(err,row){console.log(err,row)});

