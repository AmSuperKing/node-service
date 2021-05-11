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
  const sql =`SELECT * FROM usertable WHERE user_name = '${req.body.account}'`;
  // console.log('/api/userLogin 登录请求参数', req.body);
  // console.log('/api/userLogin sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/userLogin  err:', err);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    };
    if (results.length > 0) {
      // console.log('/api/userLogin', results)
      if(results[0].password == req.body.password) {
        res.status(200).json({
          code: 200,
          data: results,
          message: '登录成功'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 100,
          data: [{}],
          message: '密码错误'
        });
        res.end();
      }
    } else {
      // console.log('/api/userLogin', results)
      res.status(200).json({
        code: 100,
        data: [{}],
        message: '账号不存在'
      });
      res.end();
    };
  });
});

// 获取用户名称
router.post('/getUserName', (req, res, next) => {
  const sql =`SELECT user_name FROM usertable WHERE user_id = '${req.body.user_id}'`;
  // console.log('/api/getUserName 获取用户名称请求参数', req.body);
  // console.log('/api/getUserName sql:', sql);
  connection.query(sql,(err, results) => {
    if(err){
      console.log('/api/getUserName  err:', err);
      return res.status(500).json({
        code: 500,
        message: '服务器获取数据出错'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '获取用户数据成功'
      });
      res.end();
    } else {
      res.status(500).json({
        code: 500,
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
  // console.log('dispatch_id', dispatch_id)
  // usertable为表名
  const inset_sql =`INSERT IGNORE INTO usertable(user_id,password,user_name)
  VALUES ('${dispatch_id}','${req.body.password}','${req.body.account}')`;
  // console.log('/api/userRegister 注册请求参数', req.body);
  // console.log('/api/userRegister sql:', inset_sql);
  connection.query(inset_sql,(err, result) => {
    if(err){
      console.log('/api/userRegister err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      // console.log('insert result.affectedRows:', result.affectedRows);
      if (result.affectedRows) {
        res.status(200).json({
          code: 200,
          message: '注册成功'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 0,
          message: '用户已存在'
        });
        res.end();
      }
    };
  });
});

// 添加申诉
router.post('/addAppeal', (req, res, next) => {
  let inset_sql =
  `INSERT IGNORE INTO appeal_list(user_name,appeal_title,appeal_date,appeal_desc,appeal_prove,appeal_contact)
  VALUES ('${req.body.account}','${req.body.title}','${req.body.date}','${req.body.desc}','${req.body.prove}','${req.body.contact}')`;
  // console.log('/api/addAppeal 请求参数', req.body);
  // console.log('/api/addAppeal sql:', inset_sql);
  connection.query(inset_sql, (err, result) => {
    if(err){
      console.log('/api/addAppeal err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      // console.log('insert result.affectedRows:', result.affectedRows);
      if (result.affectedRows) {
        res.status(200).json({
          code: 200,
          message: '此账号申诉已提交'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 100,
          message: '该账号申诉已存在'
        });
        res.end();
      }
    };
  });
});

// 获取密保
router.get('/getQuestion', (req, res, next) => {
  let select_sql =
  `SELECT * from usertable
  WHERE user_name = '${req.query.user_name}'`;
  // console.log('/api/getQuestion 请求参数', req.query);
  // console.log('/api/getQuestion sql:', select_sql);
  connection.query(select_sql, (err, result) => {
    if(err){
      console.log('/api/addAppeal err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      // console.log('getQuestion', result)
      if (result.length) {
        if (result[0].question1 != null || result[0].question2 != null) {
          let queryRes = [{
            question: result[0].question1
          }, {
            question: result[0].question2
          }]
          res.status(200).json({
            code: 200,
            data: queryRes,
            message: '获取密保问题成功'
          });
          res.end();
        } else {
          res.status(200).json({
            code: 100,
            data: [],
            message: '该账户未设置密保问题'
          });
          res.end();
        }
      } else {
        res.status(200).json({
          code: 100,
          message: '该账户不存在'
        });
        res.end();
      }
    };
  });
});

// 密保回答验证
router.post('/confirmAnswer', (req, res, next) => {
  let inset_sql =
  `SELECT * from usertable
  WHERE user_name = '${req.body.user_name}'`;
  // console.log('/api/confirmAnswer 请求参数', req.body);
  // console.log('/api/confirmAnswer sql:', inset_sql);
  connection.query(inset_sql, (err, result) => {
    if(err){
      console.log('/api/confirmAnswer err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      if(result.length) {
        // console.log('confirmAnswer:', result)
        if(result[0].question1 == req.body.question) {
          if (result[0].answer1 == req.body.answer) {
            res.status(200).json({
              code: 200,
              message: '验证通过'
            });
            res.end();
          } else {
            res.status(200).json({
              code: 100,
              message: '验证失败'
            });
            res.end();
          }
        } else if(result[0].question2 == req.body.question) {
          if (result[0].answer2 == req.body.answer) {
            res.status(200).json({
              code: 200,
              message: '验证通过'
            });
            res.end();
          } else {
            res.status(200).json({
              code: 100,
              message: '验证失败'
            });
            res.end();
          }
        }
      } else {
        res.status(200).json({
          code: 100,
          message: '查询信息出错'
        });
        res.end();
      }
    };
  });
});

// 重置密码
router.post('/resetPwd', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`UPDATE usertable
  SET password = '${req.body.password}'
  WHERE user_name = '${req.body.account}'`;
  // console.log('/api/resetPwd sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/resetPwd err:', err);
      return res.status(500).json({
        code: 500,
        message: '重置密码出错'
      });
    };
    if(results.affectedRows) {
      res.status(200).json({
        code: 200,
        message: '重置密码成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '重置密码失败'
      });
      res.end();
    }
  });
});

module.exports = router;