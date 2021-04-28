var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var cors = require('cors'); // CORS模块，处理web端跨域问题
var path = require('path');

router.use(cors());

// 使用mysql中间件连接MySQL数据库
var mysql_connection = require('../sql/sql');
var connection = mysql_connection.mysql_connection

/* Document page api. */

// 获取文档数据列表
router.post('/getDocumentList', (req, res, next) => {
  console.log(req.body)
  const sql =`SELECT COUNT(*) FROM document_list;
  SELECT * FROM document_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  console.log('/api/getDocumentList  sql:', sql);
  console.log();
  connection.query(sql, (err, results) =>{
    if(err){
      console.log('/api/getDocumentList  err:', err);
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

// 搜索文档
router.get('/searchDocument', (req, res, next) => {
  console.log('req.body:', req.body)
  console.log('req.query:', req.query);
  let sql =`SELECT * FROM document_list
  WHERE  LOWER(name) LIKE LOWER('%${req.query.search}%')`;
  console.log('/api/searchDocument sql:', sql);
  console.log();
  connection.query(sql, (err, results) =>{
    if(err){
      console.log('/api/searchDocument err:', err);
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

// 获取文档目录
router.post('/getDocSectionList', (req, res, next) => {
  console.log('req.body:', req.body)
  let sql =`SELECT * FROM document_section_list
  WHERE LOWER(document_name) = LOWER('${req.body.document_name}')`;
  console.log('/api/getDocSectionList sql:', sql);
  console.log();
  connection.query(sql, (err, results) =>{
    if(err){
      console.log('/api/getDocSectionList err:', err);
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

var pathParentDir = path.resolve(__dirname, '..');
var prePath = path.join(pathParentDir, 'public');

// 获取章节文件
router.post('/getDocumentSection', (req, res, next) => {
  const pathStr = req.body.params.fileKey[0] + "\\" + req.body.params.fileKey[1] + "\\" + req.body.params.fileKey[2];
  res.sendFile(prePath + "\\" + pathStr + ".html");
});

module.exports = router;
