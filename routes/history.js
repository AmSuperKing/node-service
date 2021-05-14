var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var cors = require('cors'); // CORS模块，处理web端跨域问题
var path = require('path');

router.use(cors());

// 使用mysql中间件连接MySQL数据库
var mysql_connection = require('../sql/sql');
var connection = mysql_connection.mysql_connection

/* add History api. */

// 添加书签
router.post('/addHistory', (req, res, next) => {
  // usertable为表名
  const inset_sql =`INSERT IGNORE INTO history_list(history_title,history_time,user_id,history_path)
  VALUES ('${req.body.title}','${req.body.time}','${req.body.id}','${req.body.path}')`;
  // console.log('/api/addHistory 参数', req.body);
  // console.log('/api/addHistory sql:', inset_sql);
  connection.query(inset_sql,(err, result) => {
    if(err){
      console.log('/api/addHistory err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      // console.log('insert result.affectedRows:', result.affectedRows);
      if (result.affectedRows) {
        res.status(200).json({
          code: 200,
          message: '添加成功'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 0,
          message: '记录已存在'
        });
        res.end();
      }
    };
  });
});

// 获取用户书签列表
router.post('/userHistory', (req, res, next) => {
  const sql =`SELECT * FROM history_list WHERE user_id = '${req.body.user_id}'`;
  // console.log('/api/userHistory 获取用户书签列表请求参数', req.body);
  // console.log('/api/userHistory sql:', sql);
  connection.query(sql,(err, results) => {
    if(err){
      console.log('/api/userHistory  err:', err);
      return res.status(500).json({
        code: 500,
        message: '服务器获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: results,
        message: '暂无书签历史'
      });
      res.end();
    };
  });
});

// 删除书签
router.post('/delHistory', (req, res, next) => {
  const sql =`DELETE FROM history_list WHERE user_id = '${req.body.user_id}'
  AND history_title = '${req.body.history_title}' AND history_time = '${req.body.history_time}'`;
  // console.log('/api/delHistory  获取用户书签列表请求参数', req.body);
  // console.log('/api/delHistory  sql:', sql);
  connection.query(sql,(err, results) => {
    if(err){
      console.log('/api/delHistory  err:', err);
      return res.status(500).json({
        code: 500,
        message: '删除失败'
      });
    };
    if (results) {
      // console.log("/api/delHistory  DELETE Result:", results);
      return res.status(200).json({
        code: 200,
        message: '删除成功'
      });
    };
  });
});

// 获取所有书签列表
router.post('/allHistory', (req, res, next) => {
  const sql =`SELECT * FROM history_list WHERE user_id = '${req.body.user_id}'`;
  // console.log('/api/userHistory 获取用户书签列表请求参数', req.body);
  // console.log('/api/userHistory sql:', sql);
  connection.query(sql,(err, results) => {
    if(err){
      console.log('/api/userHistory  err:', err);
      return res.status(500).json({
        code: 500,
        message: '服务器获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: results,
        message: '暂无书签历史'
      });
      res.end();
    };
  });
});

module.exports = router;
