var express = require('express');
var User = require('../modules/user');
var Post = require('../modules/post');
var Crypt = require('../modules/crypt');
var router = express.Router();

var resHead = {'Content-Type':'text/json','Encodeing':'UTF-8'};
var resError = {
  200: {code:200, desc: 'Success'},
  500: {code:500, desc: 'Server Error'},
  601: {code:601, desc: 'Error in connection database'},
  2000: {code:2000, desc: '用户登入成功'},
  2001: {code:2001, desc: '用户注册成功'},
  2002: {code:2001, desc: '用户微博发送成功'},
  3001: {code:3001, desc: '用户不存在'},
  3002: {code:3002, desc: '用户口令错误'},
  4001: {code:4001, desc: '用户名已存在'},
  4002: {code:4002, desc: '所有字段不能为空'},
  5001: {code:5001, desc: '需要用户登录才能操作'},
  5002: {code:5002, desc: '提交内容不能少于5个字'},
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  res.set(resHead);
  var name = req.param('username');
  var pwd = req.param('password');
  console.log(name+" try to login");
  User.getByUsername(name, function(err, user) {
	  if(err) {
		  console.log(err);
		  res.send(resError[500]);
	  } else if (!user) {
		  res.send(resError[3001]);
	  } else if (user.password != pwd) {
		  res.send(resError[3002]);
	  } else {
		  req.session.user = user;
		  console.log("cookie=",req.headers.cookie);
		  var cks = Crypt(user.email);
		  res.setHeader('Set-Cookie', [ '__v=' + cks.v + ';path=/',
				'__al=' + cks.xs + ';path=/',
				"__a=" + cks.ht + ';path=/' ]);
		  res.send(resError[2000]);
	  }
  });
});

router.post('/reg', function(req, res, next) {
  res.set(resHead);
  var name = req.param('username');
  var nickname = req.param('nickname');
  var email = req.param('useremail');
  var pwd = req.param('password');
  email=email.trim().toLowerCase();
  if(name==""||nickname==""||email==""||pwd==""){
	  res.send(resError[4002]);
	  return;
  }
  console.log(name+" try to register");
  User.getByUsername(name, function(err, user) {
	  if(err) {
		  console.log(err);
		  res.send(resError[500]);
	  } else if (user) {
		  res.send(resError[4001]);
	  } else {
		  var user = new User(name,nickname,email,pwd);
		  user.save(function(err,userId){
			  user.id = userId;
			  req.session.user = user;
			  res.send(resError[2001]);
		  });
	  }
  });
});

router.post('/post', function(req, res, next) {
  res.set(resHead);
  var user = req.session.user;
  if(!user){
	  res.send(resError[5001]);
	  return;
  }
  var post = req.param('post');
  if(post==""||post.length<5){
	  res.send(resError[5002]);
	  return;
  }
  console.log(user.username+" try to post");
  var pst=new Post(user.id, user.nickname, post);
  pst.save(function(err,pstId){
	  pst.id = pstId;
	  res.send(resError[2002]);
  });
});

router.get('/post/all', function(req, res, next) {
  res.set(resHead);
  console.log("somebody try to view post");
  Post.getLast(50, function(err, posts){
	  res.send(posts);
  });
});

router.get('/post/last', function(req, res, next) {
  res.set(resHead);
  console.log("somebody try to view post");
  Post.getLast(3, function(err, posts){
	  res.send(posts);
  });
});

router.get('/logout', function(req, res, next) {
	delete req.session.user;
	res.redirect('/');
});

module.exports = router;
