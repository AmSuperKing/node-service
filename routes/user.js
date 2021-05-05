var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS模块，处理web端跨域问题
router.use(cors()); 

// 使用mysql中间件连接MySQL数据库
var mysql_connection = require('../sql/sql');
var connection = mysql_connection.mysql_connection

/* User page api. */

// 登录
router.post('/userLogin', function(req, res, next) {
  // usertable为表名
  const sql =`SELECT * FROM usertable WHERE user_name = '${req.body.account}' AND password = '${ req.body.password }'`;
  console.log('/api/userLogin 登录请求参数', req.body);
  console.log('/api/userLogin sql:', sql);
  console.log();
  connection.query(sql, (err, results) =>{
    if(err){
      console.log('/api/userLogin  err:', err);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    };
    if (results.length > 0) {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '登录成功'
      });
      res.end();
    } else {
      res.status(200).json ({
        code: 200,
        data: [{}],
        message: '账号/密码错误'
      });
      res.end();
    };
  });
});

// 获取用户名称
router.post('/getUserName', (req, res, next) => {
  const sql =`SELECT user_name FROM usertable WHERE user_id = '${req.body.user_id}'`;
  console.log('/api/getUserName 获取用户名称请求参数', req.body);
  console.log('/api/getUserName sql:', sql);
  console.log();
  connection.query(sql,(err, results) =>{
    if(err){
      console.log('/api/getUserName  err:', err);
      return res.status(500).json({
        code: 500,
        message: '服务器获取数据出错'
      });
    };
    if (results.length > 0) {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '获取用户数据成功'
      });
      res.end();
    } else {
      res.status(200).json ({
        code: 200,
        data: [{}],
        message: '未能正确获取用户数据'
      });
      res.end();
    };
  });
});

// 注册
router.post('/userRegister', (req, res, next) => {
  let userName = req.body.account;
  let userNameCode = '';
  var dispatch_id = '';
  for(let i = userName.length - 1; i >= 0; i--) {
    let nameChar = userName.charAt(i);
    let charCode = nameChar.charCodeAt();
    userNameCode += charCode;
  }
  // 7811710998101114是'Number'的转换
  if(userNameCode.length < 14) {
    userNameCode += '7811710998101114'
  }
  dispatch_id = '1' + userNameCode.slice(0, 14);
  console.log('dispatch_id', dispatch_id)
  // usertable为表名
  const inset_sql =`INSERT IGNORE INTO usertable(user_id,password,user_name)
  VALUES ('${dispatch_id}','${req.body.password}','${req.body.account}')`;
  console.log('/api/userRegister 注册请求参数', req.body);
  console.log('/api/userRegister sql:', inset_sql);
  console.log();
  connection.query(inset_sql,(err, result) =>{
    if(err){
      console.log('/api/userRegister err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      console.log('insert result.affectedRows:', result.affectedRows);
      if (result.affectedRows) {
        res.status(200).json ({
          code: 200,
          message: '注册成功'
        });
        res.end();
      } else {
        res.status(200).json ({
          code: 0,
          message: '用户已存在'
        });
        res.end();
      }
    };
  });
});

module.exports = router;