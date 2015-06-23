var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'zhimablog',
  port: 3306
});

module.exports = pool;
