var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'stangtang',
  port: 3306
});

var resHead = {'Content-Type':'text/json','Encodeing':'utf8'};
var resError = {
  200: {code:200, desc: 'Success'},
  500: {code: 500, desc: 'Server Error'},
  601: {code: 601, desc: 'Error in connection database'}
};

var getArticleListByPage = function(req, res, page, count){
  pool.getConnection(function(err, connection){
    if(err){
	  connection.release();
	  res.json(resError[601]);
	  return;
    }
    console.log('connected as id ' + connection.threadId);
    var sql = 'SELECT a.* FROM BARTICLE a '
	  +'RIGHT JOIN '
	  +'(SELECT ART_ID FROM BARTICLE '
	  +'LIMIT ?, ?) t '
	  +'on t.ART_ID=a.ART_ID ';
    connection.query(sql, [(page-1)*count, count], function(err, rows){
        connection.release();
        if(!err) {
            res.json(rows);
        }
    });
    connection.on('error', function(err) {
      res.json(resError[601]);
      return;
    });
  });
}

router.get('/article/list/:page', function(req, res, next) {
  res.set(resHead);
  var count = 10;
  var page = req.param('page');
  getArticleListByPage(req, res, page, count);
});

var getArticleById = function(req, res, artId){
  pool.getConnection(function(err, connection){
    if(err){
	  connection.release();
	  res.json(resError[601]);
	  return;
    }
    console.log('connected as id ' + connection.threadId);
    var sql = 'SELECT a.*, x.ART_CONTENT_HTML '
      +'FROM BARTICLE a '
      +'LEFT JOIN XARTICLE x ON a.ART_ID=x.ART_ID '
      +'WHERE a.ART_ID=? ';
    connection.query(sql, [artId], function(err, rows){
        connection.release();
        if(!err) {
            res.json(rows);
        }
    });
    connection.on('error', function(err) {
      res.json(resError[601]);
      return;
    });
  });
}

router.get('/article/view/:artId', function(req, res, next) {
  res.set(resHead);
  var artId = req.param('artId');
  getArticleById(req, res, artId);
});

module.exports = router;
