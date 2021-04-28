var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS模块，处理web端跨域问题
router.use(cors()); 

// 使用mysql中间件连接MySQL数据库
var mysql_connection = require('../sql/sql');
var connection = mysql_connection.mysql_connection

/* Index page api. */

// 登录
router.post('/userLogin', function(req, res, next) {
  // usertable为表名
  const sql =`SELECT * FROM usertable WHERE user_id = '${req.body.account}' AND password = '${ req.body.password }'`;
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
  // usertable为表名
  const inset_sql =`INSERT IGNORE INTO usertable(user_id,password,user_name)
  VALUES ('${req.body.account}','${req.body.password}','${req.body.account}')`;
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

// 获取用户书签列表
router.post('/userHistory', (req, res, next) => {
  const sql =`SELECT * FROM history_list WHERE user_id = '${req.body.user_id}'`;
  console.log('/api/userHistory 获取用户书签列表请求参数', req.body);
  console.log('/api/userHistory sql:', sql);
  console.log();
  connection.query(sql,(err, results) =>{
    if(err){
      console.log('/api/userHistory  err:', err);
      return res.status(500).json({
        code: 500,
        message: '服务器获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json ({
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
  console.log('/api/delHistory  获取用户书签列表请求参数', req.body);
  console.log('/api/delHistory  sql:', sql);
  console.log();
  connection.query(sql,(err, results) =>{
    if(err){
      console.log('/api/delHistory  err:', err);
      return res.status(500).json({
        code: 500,
        message: '删除失败'
      });
    };
    if (results) {
      console.log("/api/delHistory  DELETE Result:", results);
      return res.status(200).json({
        code: 200,
        message: '删除成功'
      });
    };
  });
});

// 获取文档推荐列表
router.get('/getDocumentRec', (req, res, next) => {
  const sql =`SELECT * FROM document_list ORDER BY RAND() LIMIT 6`;
  console.log('/api/getDocumentRec  sql:', sql);
  console.log();
  connection.query(sql,(err, results) =>{
    if(err){
      console.log('/api/getDocumentRec  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取视频推荐列表
router.get('/getVideoRec', (req, res, next) => {
  const sql =`SELECT * FROM video_list ORDER BY RAND() LIMIT 3`;
  console.log('/api/getVideoRec  sql:', sql);
  console.log();
  connection.query(sql,(err, results) =>{
    if(err){
      console.log('/api/getVideoRec  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取电子书推荐列表
router.get('/getEbookRec', (req, res, next) => {
  const sql =`SELECT * FROM ebook_list ORDER BY RAND() LIMIT 4`;
  console.log('/api/getEbookRec sql:', sql);
  console.log();
  connection.query(sql,(err, results) =>{
    if(err){
      console.log('/api/getEbookRec  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取课程推荐列表
router.get('/getCourseRec', (req, res, next) => {
  const sql =`SELECT * FROM course_list ORDER BY RAND() LIMIT 2`;
  console.log('/api/getCourseRec  sql:', sql);
  console.log();
  connection.query(sql,(err, results) =>{
    if(err){
      console.log('/api/getCourseRec  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json ({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取轮播推荐列表
router.get('/getCarouselRec', (req, res, next) => {
  const sql =`SELECT * FROM document_list ORDER BY RAND() LIMIT 1;
  SELECT * FROM video_list ORDER BY RAND() LIMIT 1;
  SELECT * FROM course_list ORDER BY RAND() LIMIT 1;`;
  console.log('/api/getCarouselRec sql:', sql);
  console.log();
  connection.query(sql,(err, results) =>{
    if(err){
      console.log('/api/getCarouselRec  err:', err);
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
      res.status(200).json ({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

module.exports = router;
