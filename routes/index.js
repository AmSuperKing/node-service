var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS模块，处理web端跨域问题
router.use(cors()); 

// 使用mysql中间件连接MySQL数据库
var mysql_connection = require('../sql/sql');
var connection = mysql_connection.mysql_connection

/* Index page api. */

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
