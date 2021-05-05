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

/* Ebook page api. */

// 获取电子书数据列表
router.post('/getEbookList', (req, res, next) => {
  console.log(req.body)
  const sql =`SELECT COUNT(*) FROM ebook_list;
  SELECT * FROM ebook_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  console.log('/api/getEbookList  sql:', sql);
  console.log();
  connection.query(sql, (err, results) =>{
    if(err){
      console.log('/api/getEbookList  err:', err);
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
      res.status(200).json ({
        code: 200,
        data: listData,
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

// 获取电子书信息
router.get('/getEbookInfo', (req, res, next) => {
  console.log('req.query:', req.query);
  let sql =`SELECT * FROM ebook_list
  WHERE path = '${req.query.search}'`;
  console.log('/api/getEbookInfo sql:', sql);
  console.log();
  connection.query(sql, (err, results) =>{
    if(err){
      console.log('/api/getEbookInfo err:', err);
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

// 搜索电子书
router.get('/searchEbook', (req, res, next) => {
  console.log('req.body:', req.body)
  console.log('req.query:', req.query);
  let sql =`SELECT * FROM ebook_list
  WHERE  LOWER(name) LIKE LOWER('%${req.query.search}%')`;
  console.log('/api/searchEbook sql:', sql);
  console.log();
  connection.query(sql, (err, results) =>{
    if(err){
      console.log('/api/searchEbook err:', err);
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

// 修改点击量
router.post('/updateEbookCountNum', (req, res, next) => {
  console.log('req.body:', req.body)
  let sql =`UPDATE ebook_list
  SET count_num = count_num + 1
  WHERE name = '${req.body.name}'`;
  console.log('/api/updateEbookCountNum sql:', sql);
  console.log();
  connection.query(sql, (err, results) =>{
    if(err){
      console.log('/api/updateEbookCountNum err:', err);
      return res.status(500).json({
        code: 500,
        message: '更新数据失败'
      });
    };
    if(results.affectedRows) {
      res.status(200).json ({
        code: 200,
        message: '更新数据成功'
      });
      res.end();
    }
  });
});

var pathParentDir = path.resolve(__dirname, '..');
var prePath = path.join(pathParentDir, 'public');

var serverPath = 'http://127.0.0.1:8186/';
// 获取电子书pdf文件进行阅读
router.post('/getEbookUrl', (req, res, next) => {
  const pathStr = req.body.params.fileKey.join('/');
  var pathFile = prePath + '/' + pathStr + '.pdf';
  fs.exists(pathFile, (exists) => {
    if (exists) {
      console.log(pathFile, "此格式资源文件存在");
      const ebookLink = serverPath + pathStr + '.pdf'
	  res.status(200).json ({
	    code: 200,
	    data: ebookLink,
	    message: '链接获取成功'
	  });
	  res.end();
    } else {
      console.log("暂无此格式资源");
	  res.status(200).json ({
        code: 200,
        data: '',
        message: '获取资源失败'
      });
      res.end();
    }
  });
});

// 根据类型获取文件
router.post('/getSourceByType', (req, res, next) => {
  console.log('/getSourceByType', req.body);
  const suffix = req.body[3];
  const arr = req.body;
  arr.pop();
  str = arr.join('/');
  var pathFile = prePath + '/' + str + '.' + suffix;
  fs.exists(pathFile, (exists) => {
    if (exists) {
      console.log(pathFile, "此格式资源文件存在");
      const sourceLink = serverPath + str + '.' + suffix;
      res.status(200).json ({
        code: 200,
        data: sourceLink,
        message: '下载链接获取成功'
      });
      res.end();
    } else {
      console.log("暂无此格式资源");
	  res.status(200).json ({
        code: 200,
        data: '',
        message: '暂无此格式资源'
      });
      res.end();
    }
  });
});

module.exports = router;
