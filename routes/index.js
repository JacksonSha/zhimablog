var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '芝麻博客', subpage: 'sub_home', user: req.session.user });
});

router.get('/reg', function(req, res, next) {
  res.render('index', { title: '注册芝麻博客', subpage: 'sub_reg', user: req.session.user });
});

router.get('/login', function(req, res, next) {
  res.render('index', { title: '登录芝麻博客', subpage: 'sub_login', user: req.session.user });
});

module.exports = router;
