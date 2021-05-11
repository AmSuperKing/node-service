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

/* Video page api. */

// 获取视频数据列表
router.post('/getVideoList', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM video_list;
  SELECT * FROM video_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/getVideoList  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getVideoList  err:', err);
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

// 获取视频信息
router.get('/getVideoInfo', (req, res, next) => {
  // console.log('req.query:', req.query);
  let sql =`SELECT * FROM video_list
  WHERE path = '${req.query.search}'`;
  // console.log('/api/getVideoInfo sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getVideoInfo err:', err);
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

// 搜索视频
router.get('/searchVideo', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql =`SELECT * FROM video_list
  WHERE  LOWER(name) LIKE LOWER('%${req.query.search}%')`;
  // console.log('/api/searchVideo sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchVideo err:', err);
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

// 修改点击量
router.post('/updateVideoCountNum', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`UPDATE video_list
  SET count_num = count_num + 1
  WHERE name = '${req.body.name}'`;
  // console.log('/api/updateVideoCountNum sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/updateVideoCountNum err:', err);
      return res.status(500).json({
        code: 500,
        message: '更新数据失败'
      });
    };
    if(results.affectedRows) {
      res.status(200).json({
        code: 200,
        message: '更新数据成功'
      });
      res.end();
    }
  });
});

// 获取视频目录
router.post('/getVideoSectionList', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`SELECT * FROM video_section_list
  WHERE LOWER(video_name) = LOWER('${req.body.video_name}')
  ORDER BY section_key`;
  // console.log('/api/getVideoSectionList sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getVideoSectionList err:', err);
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

// 获取当前播放视频信息
router.post('/getCurrVideoInfo', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`SELECT * FROM video_section_list
  WHERE video_name = '${req.body[0]}'
  AND section_id = '${req.body[1]}'`;
  // console.log('/api/getCurrVideoInfo sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getCurrVideoInfo err:', err);
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

var pathParentDir = path.resolve(__dirname, '..');
var prePath = path.join(pathParentDir, 'public');

var serverPath = 'http://127.0.0.1:8186/';
// 获取章节文件
router.post('/downloadVideo', (req, res, next) => {
  const pathStr = req.body.params.fileKey.join('/');
  const mp4File = prePath + '/' + pathStr + '.mp4';
  const flvFile = prePath + '/' + pathStr + '.flv';
  fs.exists(mp4File, (exists) => {
    if (exists) {
      // console.log("mp4文件存在");
      const mp4Link = serverPath + pathStr + '.mp4';
      res.status(200).json({
        code: 200,
        type: 'mp4',
        data: mp4Link,
        message: '下载链接获取成功'
      });
      res.end();
    }
  });
  fs.exists(flvFile, (exists) => {
    if (exists) {
      // console.log("flv文件存在");
      const flvLink = serverPath + pathStr + '.flv';
      res.status(200).json({
        code: 200,
        type: 'flv',
        data: flvLink,
        message: '下载链接获取成功'
      });
      res.end();
    }
  });
});

module.exports = router;
