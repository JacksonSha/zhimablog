var db = require('./db');

function Post() {
	this.id=null;
	this.userId=null;
	this.userNickname=null;
	this.content=null;
	this.createDt=null;
	this.updateDt=null;
	if(arguments.length==1){
		post = arguments[0];
		this.id = (post&&post.PST_ID) || null;
		this.userId = (post&&post.PST_USR_ID) || null;
		this.userNickname = (post&&post.PST_USR_NICKNAME) || null;
		this.content = (post&&post.PST_CONTENT) || null;
		this.createDt = (post&&new Date(post.PST_CREATE_DT)) || null;
		this.updateDt = (post&&new Date(post.PST_UPDATE_DT)) || null;
	}
	if(arguments.length==2 && arguments[0].constructor===Number){
		this.userId = arguments[0];
		this.content = arguments[1];
	}
	if(arguments.length==3 && arguments[0].constructor===Number){
		this.userId = arguments[0];
		this.userNickname = arguments[1];
		this.content = arguments[2];
	}
};
module.exports = Post;

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

Post.prototype.save = function (callback) {
	var post = this;
	db.getConnection(function(err, connection){
	    var sql = 'INSERT INTO z_post '
	    	+'(PST_USR_ID,PST_USR_NICKNAME,PST_CONTENT,PST_CREATE_DT,PST_UPDATE_DT) '
	    	+'VALUES (?,?,?,now(),now()) ';
	    var params = [post.userId, post.userNickname, post.content];
		connectUtil(err, connection, sql, params, function(err, res){
			callback(err, res.insertId);
		});
	});
};

Post.getByUserId = function (userId, callback) {
	db.getConnection(function(err, connection){
	    console.log('connected as id ' + connection.threadId);
	    var sql = 'SELECT * FROM z_post WHERE PST_USR_ID=? order by PST_ID desc';
	    connectUtil(err, connection, sql, [userId], function(err, rows){
	    	if(err){
	    		callback(err);
	    	} else if(rows.length==0) {
	    		callback(err);
	    	} else {
	    		var posts=[];
	    		for(var i=0;i<rows.length;i++){
	    			var post=new Post(rows[i]);
	    			posts.push(post);
	    		}
	    		callback(err, posts);
	    	}
		});
	});
};

Post.getAll = function (callback) {
	db.getConnection(function(err, connection){
	    console.log('connected as id ' + connection.threadId);
	    var sql = 'SELECT * FROM z_post order by PST_ID desc ';
	    connectUtil(err, connection, sql, [], function(err, rows){
	    	if(err){
	    		callback(err);
	    	} else if(rows.length==0) {
	    		callback(err);
	    	} else {
	    		var posts=[];
	    		for(var i=0;i<rows.length;i++){
	    			var post=new Post(rows[i]);
	    			posts.push(post);
	    		}
	    		callback(err, posts);
	    	}
		});
	});
};

Post.getLast = function (num, callback) {
	db.getConnection(function(err, connection){
	    console.log('connected as id ' + connection.threadId);
	    var sql = 'SELECT * FROM z_post order by PST_ID desc limit ? ';
	    connectUtil(err, connection, sql, [num], function(err, rows){
	    	if(err){
	    		callback(err);
	    	} else if(rows.length==0) {
	    		callback(err);
	    	} else {
	    		var posts=[];
	    		for(var i=0;i<rows.length;i++){
	    			var post=new Post(rows[i]);
	    			posts.push(post);
	    		}
	    		callback(err, posts);
	    	}
		});
	});
};


//Post.getAll(function(err,posts){
//	console.log(err,posts);
//});

//var p = new Post(1,'芝麻加糖','东风破早梅 向暖一枝开 冰雪无人见 春从天上来');
//p.save(function(err,row){console.log(err,row)});

