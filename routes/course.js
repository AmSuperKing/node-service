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

/* Course page api. */

// 获取课程数据列表
router.post('/getCourseList', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM course_list;
  SELECT * FROM course_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/getCourseList  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getCourseList  err:', err);
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

// 获取加入课程数据列表
router.post('/getJoinCourseList', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM course_join_list
  WHERE joiner = '${req.body.user}';
  SELECT * FROM course_join_list
  WHERE joiner = '${req.body.user}'
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/getJoinCourseList  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getJoinCourseList  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    let listData = {
      total: 0,
      data: []
    }
    if (results[0][0]['COUNT(*)'] > 0) {
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
        data: listData,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取创建的课程数据列表
router.post('/getMyCourseList', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM course_list
  WHERE creator = '${req.body.user}';
  SELECT * FROM course_list
  WHERE creator = '${req.body.user}'
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/getMyCourseList  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getMyCourseList  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    let listData = {
      total: 0,
      data: []
    }
    if (results[0][0]['COUNT(*)'] > 0) {
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
        data: listData,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取创建的课程数据列表
router.post('/getAllCourseList', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM course_list;
  SELECT * FROM course_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/getAllCourseList  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getAllCourseList  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    let listData = {
      total: 0,
      data: []
    }
    if (results[0][0]['COUNT(*)'] > 0) {
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
        data: listData,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取用户创建的全部课程数据列表，不分页
router.post('/getMyAllCourse', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT * FROM course_list
  WHERE creator = '${req.body.user}'`;
  // console.log('/api/getMyAllCourse  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getMyAllCourse  err:', err);
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

// 获取用户创建的全部课程数据列表，不分页
router.post('/getUserAllCourse', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT * FROM course_list`;
  // console.log('/api/getUserAllCourse  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getUserAllCourse  err:', err);
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

// 获取课程信息
router.get('/getCourseInfo', (req, res, next) => {
  // console.log('req.query:', req.query);
  let sql =`SELECT * FROM course_list
  WHERE path = '${req.query.search}'`;
  // console.log('/api/getCourseInfo sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getCourseInfo err:', err);
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

// 获取课程加入人数
router.get('/getJoinNum', (req, res, next) => {
  // console.log('req.query:', req.query);
  let sql =`SELECT COUNT(*) FROM course_join_list
  WHERE path = '${req.query.course}';`;
  // console.log('/api/getJoinNum sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getJoinNum err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    let total = results[0]['COUNT(*)']
    if (total) {
      res.status(200).json({
        code: 200,
        total: total,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        total: total,
        message: '暂无加入'
      });
      res.end();
    };
  });
});

// 获取是否已经加入课程
router.post('/judeJoin', (req, res, next) => {
  // console.log('req.body:', req.body);
  let sql =`SELECT * FROM course_join_list
  WHERE path = '${req.body.course}'
  AND joiner = '${req.body.userId}';`;
  // console.log('/api/judeJoin sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/judeJoin err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        haveJoin: true,
        message: '已加入课程'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        haveJoin: false,
        message: '暂未加入课程'
      });
      res.end();
    };
  });
});

// 加入课程
router.post('/joinCourse', (req, res, next) => {
  // console.log('req.body:', req.body);
  let sql =`INSERT INTO course_join_list
  VALUES(null,'${req.body.name}','${req.body.text}','${req.body.path}','${req.body.imgUrl}','${req.body.joiner}','${req.body.count}');`;
  console.log('/api/joinCourse sql:', sql);
  connection.query(sql, (err, result) => {
    if(err){
      console.log('/api/joinCourse err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (result.affectedRows) {
      res.status(200).json({
        code: 200,
        state: 'success',
        message: '已加入课程'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        state: 'fail',
        message: '加入课程失败'
      });
      res.end();
    };
  });
});

// 退出课程
router.post('/exitCourse', (req, res, next) => {
  // console.log('req.body:', req.body);
  let sql =`DELETE FROM course_join_list
  WHERE path = '${req.body.path}'
  AND joiner = '${req.body.userId}'`;
  console.log('/api/exitCourse sql:', sql);
  connection.query(sql, (err, result) => {
    if(err){
      console.log('/api/exitCourse err:', err);
      return res.status(500).json({
        code: 500,
        message: '操作失败'
      });
    };
    if (result.affectedRows) {
      res.status(200).json({
        code: 200,
        state: 'success',
        message: '已退出课程'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        state: 'fail',
        message: '退出课程失败'
      });
      res.end();
    };
  });
});

// 搜索课程
router.get('/searchCourse', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql =`SELECT * FROM course_list
  WHERE  LOWER(name) LIKE LOWER('%${req.query.search}%')`;
  // console.log('/api/searchCourse sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchCourse err:', err);
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

// 搜索加入的课程
router.get('/searchJoinCourse', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql =`SELECT * FROM course_join_list
  WHERE LOWER(name) LIKE LOWER('%${req.query.search}%')
  AND joiner = '${req.query.user}'`;
  // console.log('/api/searchJoinCourse sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchJoinCourse err:', err);
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

// 搜索创建的课程
router.get('/searchCreateCourse', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql =`SELECT * FROM course_list
  WHERE LOWER(name) LIKE LOWER('%${req.query.search}%')
  AND creator = '${req.query.user}'`;
  // console.log('/api/searchCreateCourse sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchCreateCourse err:', err);
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
router.post('/updateCourseCountNum', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`UPDATE course_list
  SET count_num = count_num + 1
  WHERE name = '${req.body.name}';`;
  // console.log('/api/updateCourseCountNum sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/updateCourseCountNum err:', err);
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

// 获取课程资源目录
router.post('/getCourseResource', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`SELECT * FROM course_resource WHERE name = '${req.body.course}';`;
  // console.log('/api/getCourseResource sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getCourseResource err:', err);
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

// 获取当前打开课程资源文件信息
router.post('/getCurrFileInfo', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`SELECT * FROM course_resource
  WHERE name = '${req.body.type}' AND source_name = '${req.body.file}';`;
  // console.log('/api/getCurrFileInfo sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getCurrFileInfo err:', err);
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

// 修改当前打开课程资源文件点击量
router.post('/updateFileCountNum', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`UPDATE course_resource
  SET count_num = count_num + 1
  WHERE name = '${req.body.name}' AND source_name = '${req.body.source_name}';`;
  // console.log('/api/updateFileCountNum sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/updateFileCountNum err:', err);
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


var pathParentDir = path.resolve(__dirname, '..');
var prePath = path.join(pathParentDir, 'public');

var serverPath = 'http://127.0.0.1:8186/';

// 修改课程信息
router.post('/updateCourseInfo', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`UPDATE course_list
  SET name = '${req.body.name}', describe_text = '${req.body.desc}'
  WHERE path = '${req.body.path}';`;
  // console.log('/api/updateCourseInfo sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/updateCourseInfo err:', err);
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
    } else {
      res.status(200).json({
        code: 100,
        message: '更新数据失败'
      });
      res.end();
    }
  });
});

// 删除课程
router.post('/delCourse', (req, res, next) => {
  // console.log('req.body:', req.body)
  // img
  let imgArr = req.body.imgUrl.split('/');
  let imgLen = imgArr.length;
  let imgPath = imgArr[imgLen -2] + '/' + imgArr[imgLen -1];
  let imgParam = './public/' + imgArr[imgLen -2] + '/' + imgArr[imgLen -1];
  let sql =`DELETE FROM course_join_list WHERE path = '${req.body.path}';
  DELETE FROM course_resource WHERE name = '${req.body.path}';
  DELETE FROM course_list WHERE path = '${req.body.path}';
  DELETE FROM file_url WHERE pathName = '${imgPath}';`;
  // console.log('/api/delCourse sql:', sql);
  fs.unlink(imgParam, (error) => {
    if(error) {
        console.log(error);
        return false;
    } else {
      delImg = true
      console.log('删除文件成功');
    }
  })
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delCourse err:', err);
      return res.status(500).json({
        code: 500,
        message: '删除数据失败'
      });
    };
    console.log(results)
    if(results[2].affectedRows) {
      res.status(200).json({
        code: 200,
        message: '删除数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除数据失败'
      });
      res.end();
    }
  });
});

module.exports = router;
