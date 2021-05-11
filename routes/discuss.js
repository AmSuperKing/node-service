var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var cors = require('cors'); // CORS模块，处理web端跨域问题
var path = require('path');
var fs = require("fs");

router.use(cors());

// 使用mysql中间件连接MySQL数据库
var mysql_connection = require('../sql/sql');
var connection = mysql_connection.mysql_connection

/* Discuss page api. */

// 获取问题数据列表
router.post('/getQuestionList', (req, res, next) => {
  // console.log(req.body)
  const sql =`SELECT COUNT(*) FROM question_list;
  SELECT * FROM question_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  // console.log('/api/getQuestionList  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getQuestionList  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results[0][0]['COUNT(*)'] > 0) {
      var listData = {
        total: '',
        data: []
      }
      listData.total = results[0][0]['COUNT(*)']
      listData.data = results[1]
      res.status(200).json({
        code: 200,
        data: listData,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取某个问题的回答数据列表
router.post('/getAnswerList', (req, res, next) => {
  // console.log(req.body)
  const sql =`SELECT * FROM answer_list
  WHERE question_id = '${req.body.key}'`;
  // console.log('/api/getAnswerList  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getAnswerList  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
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
        message: '暂无回答'
      });
      res.end();
    };
  });
});

// 添加回答
router.post('/addAnswer', (req, res, next) => {
  const inset_sql =`INSERT INTO answer_list
  VALUES(null,'${req.body.questionId}','${req.body.content}','${req.body.userId}','${req.body.userName}','${req.body.time}')`;
  // console.log('/api/addAnswer 请求参数', req.body);
  // console.log('/api/addAnswer sql:', inset_sql);
  connection.query(inset_sql,(err, result) => {
    if(err){
      console.log('/api/addAnswer err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      // console.log('insert result.affectedRows:', result.affectedRows);
      if (result.affectedRows) {
        res.status(200).json({
          code: 200,
          message: '添加回答成功'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 0,
          message: '添加回答失败'
        });
        res.end();
      }
    };
  });
});

// 添加问题
router.post('/addQuestion', (req, res, next) => {
  let timeStr = req.body.time;
  let preStr = 'que';
  let suffixStr = timeStr.split(' ')[0];
  let idStr = preStr + suffixStr;
  let questionId = '';
  for(let i = 0; i < idStr.length; i++) {
    let str = idStr.charAt(i);
	let code = str.charCodeAt();
	questionId += code;
  }
  console.log('questionId', questionId.slice(0, 14));
  let qId = '2' + questionId.slice(0, 14);
  let sql = `INSERT INTO question_list(question_id, question_title, create_userId, create_userName, create_time)
    VALUES ('${qId}', '${req.body.content}', '${req.body.userId}', '${req.body.userName}', '${req.body.time}')`
  console.log('/api/addQuestion 请求参数', req.body);
  console.log('/api/addQuestion sql:', sql);
  connection.query(sql, (err, result) => {
    if(err){
      console.log('/api/addQuestion err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      // console.log('insert result.affectedRows:', result.affectedRows);
      if (result.affectedRows) {
        res.status(200).json({
          code: 200,
          message: '添加回答成功'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 0,
          message: '添加回答失败'
        });
        res.end();
      }
    };
  });
});

// 搜索问题
router.post('/searchQuestion', (req, res, next) => {
  console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql =`SELECT * FROM question_list
  WHERE LOWER(question_title) LIKE LOWER('%${req.body.key}%')`;
  // console.log('/api/searchQuestion sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchQuestion err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
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
        message: '暂无数据'
      });
      res.end();
    };
  });
});

module.exports = router;