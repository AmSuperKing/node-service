var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS模块，处理web端跨域问题
router.use(cors()); 

// 使用mysql中间件连接MySQL数据库
var mysql_connection = require('../sql/sql');
var connection = mysql_connection.mysql_connection

/* about_detail page api. */

// 添加内容纠正
router.post('/addCorrect', (req, res, next) => {
  let inset_sql =
  `INSERT IGNORE INTO correct_list(correctTitle,correctSection,correctContent,correctContact)
  VALUES ('${req.body.title}','${req.body.section}','${req.body.content}','${req.body.contact}')`;
  console.log('/api/addCorrect 请求参数', req.body);
  console.log('/api/addCorrect sql:', inset_sql);
  connection.query(inset_sql, (err, result) => {
    if(err){
      console.log('/api/addCorrect err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      console.log('insert result.affectedRows:', result.affectedRows);
      if (result.affectedRows) {
        res.status(200).json({
          code: 200,
          message: '问题已成功提交'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 100,
          message: '问题提交已存在'
        });
        res.end();
      }
    };
  });
});

// 添加内容维权投诉
router.post('/addProtect', (req, res, next) => {
  let inset_sql =
  `INSERT IGNORE INTO protect_list(protectTitle,protectSection,protectContent,protectContact)
  VALUES ('${req.body.title}','${req.body.section}','${req.body.content}','${req.body.contact}')`;
  console.log('/api/addProtect 请求参数', req.body);
  console.log('/api/addProtect sql:', inset_sql);
  connection.query(inset_sql, (err, result) => {
    if(err){
      console.log('/api/addProtect err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      console.log('insert result.affectedRows:', result.affectedRows);
      if (result.affectedRows) {
        res.status(200).json({
          code: 200,
          message: '您的维权投诉已成功提交'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 100,
          message: '您的维权投诉已存在'
        });
        res.end();
      }
    };
  });
});

// 添加网站建议
router.post('/addAdvice', (req, res, next) => {
  let inset_sql =
  `INSERT IGNORE INTO advice_list(adviceContent,adviceContact)
  VALUES ('${req.body.content}','${req.body.contact}')`;
  console.log('/api/addAdvice 请求参数', req.body);
  console.log('/api/addAdvice sql:', inset_sql);
  connection.query(inset_sql, (err, result) => {
    if(err){
      console.log('/api/addAdvice err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      console.log('insert result.affectedRows:', result.affectedRows);
      if (result.affectedRows) {
        res.status(200).json({
          code: 200,
          message: '您的建议已成功提交'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 100,
          message: '您的建议已存在'
        });
        res.end();
      }
    };
  });
});

module.exports = router;