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

/* UserCenter page api. */

// 获取用户角色
router.post('/getRole', (req, res, next) => {
  // console.log('req.query:', req.query);
  let sql =`SELECT user_role FROM usertable
  WHERE user_id = '${req.body.userId}'`;
  // console.log('/api/getRole sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getRole err:', err);
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

// 获取角色权限菜单
router.get('/getRoleMenu', (req, res, next) => {
  // console.log('req.query:', req.query);
  let sql =`SELECT * FROM role_menu
  WHERE user_role = '${req.query.role}'`;
  // console.log('/api/getRoleMenu sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getRoleMenu err:', err);
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

// 用户中心页搜索创建的课程
router.post('/searchCourseByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.name) {
  	sql = `SELECT * FROM course_list
  	WHERE LOWER(name) LIKE LOWER('%${req.body.name}%')
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.describe_text) {
  	sql = `SELECT * FROM course_list
  	WHERE LOWER(describe_text) LIKE LOWER('%${req.body.describe_text}%')
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.count_num) {
  	sql = `SELECT * FROM course_list
  	WHERE count_num = ${req.body.count_num}
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchCourseByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchCourseByKey err:', err);
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

// 管理员用户中心页搜索创建的课程
router.post('/searchAllCourseByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.name) {
  	sql = `SELECT * FROM course_list
  	WHERE LOWER(name) LIKE LOWER('%${req.body.name}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.describe_text) {
  	sql = `SELECT * FROM course_list
  	WHERE LOWER(describe_text) LIKE LOWER('%${req.body.describe_text}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.count_num) {
  	sql = `SELECT * FROM course_list
  	WHERE count_num = ${req.body.count_num}
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchAllCourseByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchAllCourseByKey err:', err);
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

// 用户中心获取课程资源目录
router.post('/getCourseFileList', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`SELECT * FROM course_resource
  WHERE creator = '${req.body.userId}'
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  // console.log('/api/getCourseFileList sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getCourseFileList err:', err);
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

// 管理员用户中心获取课程资源目录
router.post('/getAllCourseFileList', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`SELECT * FROM course_resource
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  // console.log('/api/getAllCourseFileList sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getAllCourseFileList err:', err);
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

// 用户中心页搜索课程文件
router.post('/searchFileByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.source_name) {
  	sql = `SELECT * FROM course_resource
  	WHERE LOWER(source_name) LIKE LOWER('%${req.body.source_name}%')
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.source_type) {
  	sql = `SELECT * FROM course_resource
  	WHERE LOWER(source_type) LIKE LOWER('%${req.body.source_type}%')
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.key) {
  	sql = `SELECT * FROM course_resource
  	WHERE name = '${req.body.key}'
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchFileByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchFileByKey err:', err);
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

// 用户中心页搜索课程文件
router.post('/searchAllFileByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.source_name) {
  	sql = `SELECT * FROM course_resource
  	WHERE LOWER(source_name) LIKE LOWER('%${req.body.source_name}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.source_type) {
  	sql = `SELECT * FROM course_resource
  	WHERE LOWER(source_type) LIKE LOWER('%${req.body.source_type}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.key) {
  	sql = `SELECT * FROM course_resource
  	WHERE name = '${req.body.key}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchAllFileByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchAllFileByKey err:', err);
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


// 用户中心上传课程资源
router.post('/uploadCourseFile', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`INSERT INTO course_resource(name,source_name,source_type,source_path,add_time,count_num,creator)
  VALUES('${req.body.course}','${req.body.fileName}','${req.body.fileType}','${req.body.fileUrl}','${req.body.uploadTime}',0,'${req.body.creator}');`;
  // console.log('/api/getCourseFileList sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getCourseFileList err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '上传文件成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '上传文件失败'
      });
      res.end();
    };
  });
});

// 用户中心创建新课程
router.post('/newCourse', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`INSERT INTO course_list(name,describe_text,path,imgUrl,count_num,creator,newTime)
  VALUES('${req.body.name}','${req.body.desc}','${req.body.path}','${req.body.imgUrl}',0,'${req.body.creator}','${req.body.newTime}');`;
  // console.log('/api/newCourse sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/newCourse err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '创建课程成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '创建课程失败'
      });
      res.end();
    };
  });
});

// 删除课程文件
router.post('/delCourseFile', (req, res, next) => {
  // console.log('req.body:', req.body)
  let fileArr = req.body.source_path.split('/');
  let fileLen = fileArr.length;
  let filePath = fileArr[fileLen - 2] + '/' + fileArr[fileLen - 1];
  let fileParam = './public/' + fileArr[fileLen - 2] + '/' + fileArr[fileLen - 1];
  // console.log('fileParam', fileParam);
  let sql =`
  DELETE FROM file_url WHERE pathName = '${filePath}';
  DELETE FROM course_resource
  WHERE name = '${req.body.name}'
  AND source_name = '${req.body.source_name}'
  AND source_type = '${req.body.source_type}'
  AND creator = '${req.body.creator}';`;
  let delFlg = false;
  fs.unlink(fileParam, (error) => {
    if(error) {
        console.log(error);
        return false;
    } else {
      delFlg = true
      console.log('删除文件成功');
    }
  })
  console.log('/api/delCourseFile sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delCourseFile err:', err);
      return res.status(500).json({
        code: 500,
        message: '删除文件失败'
      });
    };
    console.log(results)
    if(results[1].affectedRows && delFlg) {
      res.status(200).json({
        code: 200,
        message: '删除文件成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除文件失败'
      });
      res.end();
    }
  });
});

// 用户中心页搜索创建的视频教程
router.post('/searchVideoByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.name) {
  	sql = `SELECT * FROM video_list
  	WHERE LOWER(name) LIKE LOWER('%${req.body.name}%')
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.describe_text) {
  	sql = `SELECT * FROM video_list
  	WHERE LOWER(describe_text) LIKE LOWER('%${req.body.describe_text}%')
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.count_num) {
  	sql = `SELECT * FROM video_list
  	WHERE count_num = ${req.body.count_num}
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchVideoByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchVideoByKey err:', err);
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

// 用户中心页搜索创建的视频教程
router.post('/searchAllVideoByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.name) {
  	sql = `SELECT * FROM video_list
  	WHERE LOWER(name) LIKE LOWER('%${req.body.name}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.describe_text) {
  	sql = `SELECT * FROM video_list
  	WHERE LOWER(describe_text) LIKE LOWER('%${req.body.describe_text}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.count_num) {
  	sql = `SELECT * FROM video_list
  	WHERE count_num LIKE ${req.body.count_num}
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchAllVideoByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchAllVideoByKey err:', err);
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


// 用户中心获取视频教程资源目录
router.post('/getVideoFileList', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =` SELECT COUNT(*) FROM video_section_list WHERE creator = '${req.body.userId}';
  SELECT * FROM video_section_list
  WHERE creator = '${req.body.userId}'
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  // console.log('/api/getVideoFileList sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getVideoFileList err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    let listData = {
      total: 0,
      data: []
    };
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

// 管理员用户中心获取视频教程资源目录
router.post('/getAllVideoFileList', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`SELECT COUNT(*) FROM video_section_list;
  SELECT * FROM video_section_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  // console.log('/api/getAllVideoFileList sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getAllVideoFileList err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    let listData = {
      total: 0,
      data: []
    };
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

// 用户中心页搜索视频文件
router.post('/searchVideoFileByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.video_name) {
  	sql = `SELECT * FROM video_section_list
  	WHERE LOWER(video_name) LIKE LOWER('%${req.body.video_name}%')
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.section_id) {
  	sql = `SELECT * FROM video_section_list
  	WHERE LOWER(section_id) LIKE LOWER('%${req.body.section_id}%')
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.section_title) {
  	sql = `SELECT * FROM video_section_list
  	WHERE section_title = '${req.body.section_title}'
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchVideoFileByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchVideoFileByKey err:', err);
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

// 用户中心页搜索视频文件
router.post('/searchAllVideoFileByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.video_name) {
  	sql = `SELECT * FROM video_section_list
  	WHERE LOWER(video_name) LIKE LOWER('%${req.body.video_name}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.section_id) {
  	sql = `SELECT * FROM video_section_list
  	WHERE LOWER(section_id) LIKE LOWER('%${req.body.section_id}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.section_title) {
  	sql = `SELECT * FROM video_section_list
  	WHERE section_title = '${req.body.section_title}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchAllVideoFileByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchAllVideoFileByKey err:', err);
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



// 用户中心上传视频资源
router.post('/uploadVideoFile', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`INSERT INTO video_section_list(video_name,section_title,section_id,section_key,creator,newTime)
  VALUES('${req.body.video}','${req.body.fileName}','${req.body.section}','${req.body.fileUrl}','${req.body.creator}','${req.body.uploadTime}');`;
  // console.log('/api/uploadVideoFile sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/uploadVideoFile err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '上传文件成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '上传文件失败'
      });
      res.end();
    };
  });
});

// 用户中心创建视频教程
router.post('/newVideo', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`INSERT INTO video_list(name,describe_text,path,imgUrl,count_num,creator,newTime)
  VALUES('${req.body.name}','${req.body.desc}','${req.body.path}','${req.body.imgUrl}',0,'${req.body.creator}','${req.body.newTime}');`;
  // console.log('/api/newCourse sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/newCourse err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '创建课程成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '创建课程失败'
      });
      res.end();
    };
  });
});

// 删除课程文件
router.post('/delVideoFile', (req, res, next) => {
  // console.log('req.body:', req.body)
  // file
  let fileArr = req.body.section_key.split('/');
  let fileLen = fileArr.length;
  let filePath = fileArr[fileLen - 2] + '/' + fileArr[fileLen - 1];
  let fileParam = './public/' + fileArr[fileLen - 2] + '/' + fileArr[fileLen - 1];
  let sql =`DELETE FROM file_url WHERE pathName = '${filePath}';
  DELETE FROM video_section_list
  WHERE video_name = '${req.body.video_name}'
  AND section_id= '${req.body.section_id}'
  AND section_key = '${req.body.section_key}'
  AND creator = '${req.body.creator}';`;
  // console.log('/api/delVideoFile sql:', sql);
  let delFlile = false;
  fs.unlink(fileParam, (error) => {
    if(error) {
        console.log(error);
        return false;
    } else {
      delFlile = true
      console.log('删除文件成功');
    }
  })
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delVideoFile err:', err);
      return res.status(500).json({
        code: 500,
        message: '删除文件失败'
      });
    };
    console.log(results)
    if(results[1].affectedRows > 0 && delFlile) {
      res.status(200).json({
        code: 200,
        message: '删除文件成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除文件失败'
      });
      res.end();
    }
  });
});


// 删除课程文件
router.post('/delAllVideoFile', (req, res, next) => {
  // console.log('req.body:', req.body)
  // file
  let fileArr = req.body.section_key.split('/');
  let fileLen = fileArr.length;
  let filePath = fileArr[fileLen - 2] + '/' + fileArr[fileLen - 1];
  let fileParam = './public/' + fileArr[fileLen - 2] + '/' + fileArr[fileLen - 1];
  let sql =`DELETE FROM file_url WHERE pathName = '${filePath}';
  DELETE FROM video_section_list
  WHERE video_name = '${req.body.video_name}'
  AND section_id= '${req.body.section_id}'
  AND section_key = '${req.body.section_key}';`;
  // console.log('/api/delAllVideoFile sql:', sql);
  let delFlile = false;
  fs.unlink(fileParam, (error) => {
    if(error) {
        console.log(error);
        return false;
    } else {
      delFlile = true
      console.log('删除文件成功');
    }
  })
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delAllVideoFile err:', err);
      return res.status(500).json({
        code: 500,
        message: '删除文件失败'
      });
    };
    console.log(results)
    if(results[1].affectedRows > 0 && delFlile) {
      res.status(200).json({
        code: 200,
        message: '删除文件成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除文件失败'
      });
      res.end();
    }
  });
});

// 用户中心页搜索创建的电子书
router.post('/searchEbookByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.name) {
  	sql = `SELECT * FROM ebook_list
  	WHERE LOWER(name) LIKE LOWER('%${req.body.name}%')
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.describe_text) {
  	sql = `SELECT * FROM ebook_list
  	WHERE LOWER(describe_text) LIKE LOWER('%${req.body.describe_text}%')
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.count_num) {
  	sql = `SELECT * FROM ebook_list
  	WHERE count_num = ${req.body.count_num}
  	AND creator = '${req.body.user}'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchEbookByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchEbookByKey err:', err);
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

// 用户中心页搜索创建的电子书
router.post('/searchAllEbookByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.name) {
  	sql = `SELECT * FROM ebook_list
  	WHERE LOWER(name) LIKE LOWER('%${req.body.name}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.describe_text) {
  	sql = `SELECT * FROM ebook_list
  	WHERE LOWER(describe_text) LIKE LOWER('%${req.body.describe_text}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.count_num) {
  	sql = `SELECT * FROM ebook_list
  	WHERE count_num like ${req.body.count_num}
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchAllEbookByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchAllEbookByKey err:', err);
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


// 用户中心上传电子书
router.post('/newEbook', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`INSERT INTO ebook_list(name,describe_text,path,imgUrl,count_num,creator,newTime,file_url)
  VALUES('${req.body.name}','${req.body.desc}','${req.body.path}','${req.body.imgUrl}',0,'${req.body.creator}','${req.body.uploadTime}','${req.body.fileUrl}');`;
  // console.log('/api/newCourse sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/newCourse err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '上传书籍成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '上传书籍失败'
      });
      res.end();
    };
  });
});


// 管理员获取用户列表
router.post('/getUserList', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM usertable;
  SELECT * FROM usertable
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/getUserList  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getUserList  err:', err);
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


// 管理员用户中心页搜索用户
router.post('/searchUserByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.user_id) {
  	sql = `SELECT * FROM usertable
  	WHERE LOWER(user_id) LIKE LOWER('%${req.body.user_id}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.user_name) {
  	sql = `SELECT * FROM usertable
  	WHERE LOWER(user_name) LIKE LOWER('%${req.body.user_name}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.password) {
  	sql = `SELECT * FROM usertable WHERE password LIKE '%${req.body.password}%'
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchUserByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchUserByKey err:', err);
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


// 获取所有文档教程数据列表
router.post('/getAllDocList', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM document_list;
  SELECT * FROM document_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/getAllDocList  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getAllDocList  err:', err);
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

// 用户中心页搜索文档教程
router.post('/searchDocByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.name) {
  	sql = `SELECT * FROM document_list
  	WHERE LOWER(name) LIKE LOWER('%${req.body.name}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.describe_text) {
  	sql = `SELECT * FROM document_list
  	WHERE LOWER(describe_text) LIKE LOWER('%${req.body.describe_text}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.count_num) {
  	sql = `SELECT * FROM document_list
  	WHERE count_num = ${req.body.count_num}
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchDocByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchDocByKey err:', err);
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

// 用户中心页搜索文档章节
router.post('/searchDocSecByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.document_name) {
  	sql = `SELECT * FROM document_section_list
  	WHERE LOWER(document_name) LIKE LOWER('%${req.body.document_name}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.section_title) {
  	sql = `SELECT * FROM document_section_list
  	WHERE LOWER(section_title) LIKE LOWER('%${req.body.section_title}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.section_id) {
  	sql = `SELECT * FROM document_section_list
  	WHERE LOWER(section_id) LIKE LOWER('%${req.body.section_id}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchDocSecByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchDocSecByKey err:', err);
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

// 修改文档章节标题信息
router.post('/updateDocSecInfo', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`UPDATE document_section_list
  SET section_title = '${req.body.section_title}'
  WHERE document_name = '${req.body.document_name}' AND section_key = '${req.body.section_key}';`;
  // console.log('/api/updateDocSecInfo sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/updateDocSecInfo err:', err);
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


// 获取所有申诉
router.post('/allAppeal', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM appeal_list;
  SELECT * FROM appeal_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/getAllAnsList  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/allAppeal  err:', err);
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

// 用户中心页搜索申诉
router.post('/searchAppealByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.user_name) {
    sql = `SELECT * FROM appeal_list
    WHERE LOWER(user_name) LIKE LOWER('%${req.body.user_name}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.appeal_title) {
    sql = `SELECT * FROM appeal_list
    WHERE LOWER(appeal_title) LIKE LOWER('%${req.body.appeal_title}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.appeal_desc) {
  	sql = `SELECT * FROM appeal_list
    WHERE LOWER(appeal_desc) LIKE LOWER('%${req.body.appeal_desc}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchAppealByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchAppealByKey err:', err);
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

// 删除申诉
router.post('/delAppeal', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`DELETE FROM appeal_list
  WHERE user_name = '${req.body.user_name}'
  AND appeal_title = '${req.body.appeal_title}'
  AND appeal_date = '${req.body.appeal_date}';`;
  // console.log('/api/delAppeal sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delAppeal err:', err);
      return res.status(500).json({
        code: 500,
        message: '操作数据失败'
      });
    };
    console.log(results.affectedRows)
    if(results.affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '删除成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除失败'
      });
      res.end();
    }
  });
});


// 获取所有书签
router.post('/allUserHistory', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM history_list;
  SELECT * FROM history_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/allUserHistory  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/allUserHistory  err:', err);
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

// 用户中心页搜索书签
router.post('/searchHistoryByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.history_title) {
    sql = `SELECT * FROM history_list
    WHERE LOWER(history_title) LIKE LOWER('%${req.body.history_title}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.user_id) {
    sql = `SELECT * FROM history_list
    WHERE LOWER(user_id) LIKE LOWER('%${req.body.user_id}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchHistoryByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchHistoryByKey err:', err);
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

// 删除历史
router.post('/delAllHis', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`DELETE FROM history_list
  WHERE history_title = '${req.body.history_title}'
  AND history_time = '${req.body.history_time}'
  AND user_id = '${req.body.user_id}';`;
  // console.log('/api/delAllHis sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delAllHis err:', err);
      return res.status(500).json({
        code: 500,
        message: '操作数据失败'
      });
    };
    console.log(results.affectedRows)
    if(results.affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '删除成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除失败'
      });
      res.end();
    }
  });
});

// 获取所有建议
router.post('/allUserAdvice', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM advice_list;
  SELECT * FROM advice_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/allUserAdvice  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/allUserAdvice  err:', err);
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

// 用户中心页搜索建议
router.post('/searchAdviceByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.adviceContent) {
    sql = `SELECT * FROM advice_list
    WHERE LOWER(adviceContent) LIKE LOWER('%${req.body.adviceContent}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.adviceContact) {
    sql = `SELECT * FROM advice_list
    WHERE LOWER(adviceContact) LIKE LOWER('%${req.body.adviceContact}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchAdviceByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchAdviceByKey err:', err);
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

// 删除建议
router.post('/delAdvice', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`DELETE FROM advice_list
  WHERE adviceContent = '${req.body.adviceContent}'
  AND adviceContact = '${req.body.adviceContact}';`;
  // console.log('/api/delAdvice sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delAdvice err:', err);
      return res.status(500).json({
        code: 500,
        message: '操作数据失败'
      });
    };
    console.log(results.affectedRows)
    if(results.affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '删除成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除失败'
      });
      res.end();
    }
  });
});

// 获取所有纠正
router.post('/allUserCorrect', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM correct_list;
  SELECT * FROM correct_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/allUserCorrect  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/allUserCorrect  err:', err);
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

// 用户中心页搜索纠正
router.post('/searchCorrectByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.correctTitle) {
    sql = `SELECT * FROM correct_list
    WHERE LOWER(correctTitle) LIKE LOWER('%${req.body.correctTitle}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.correctSection) {
    sql = `SELECT * FROM correct_list
    WHERE LOWER(correctSection) LIKE LOWER('%${req.body.correctSection}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.correctContent) {
    sql = `SELECT * FROM correct_list
    WHERE LOWER(correctContent) LIKE LOWER('%${req.body.correctContent}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchCorrectByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchCorrectByKey err:', err);
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

// 删除纠正
router.post('/delCorrect', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`DELETE FROM correct_list
  WHERE correctTitle = '${req.body.correctTitle}'
  AND correctContent = '${req.body.correctContent}';`;
  // console.log('/api/delCorrect sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delCorrect err:', err);
      return res.status(500).json({
        code: 500,
        message: '操作数据失败'
      });
    };
    console.log(results.affectedRows)
    if(results.affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '删除成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除失败'
      });
      res.end();
    }
  });
});

// 获取所有维权
router.post('/allUserProtect', (req, res, next) => {
  // console.log(req.body);
  const sql =`SELECT COUNT(*) FROM protect_list;
  SELECT * FROM protect_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  // console.log('/api/allUserProtect  sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/allUserProtect  err:', err);
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

// 用户中心页搜索维权
router.post('/searchProtectByKey', (req, res, next) => {
  // console.log('req.body:', req.body)
  // console.log('req.query:', req.query);
  let sql = '';
  if(req.body.protectTitle) {
    sql = `SELECT * FROM protect_list
    WHERE LOWER(protectTitle) LIKE LOWER('%${req.body.protectTitle}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.protectSection) {
    sql = `SELECT * FROM protect_list
    WHERE LOWER(protectSection) LIKE LOWER('%${req.body.protectSection}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  } else if(req.body.protectContent) {
    sql = `SELECT * FROM protect_list
    WHERE LOWER(protectContent) LIKE LOWER('%${req.body.protectContent}%')
    LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize};`;
  }
  // console.log('/api/searchProtectByKey sql:', sql);
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchProtectByKey err:', err);
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

// 删除申诉
router.post('/delProtect', (req, res, next) => {
  // console.log('req.body:', req.body)
  let sql =`DELETE FROM protect_list
  WHERE protectTitle = '${req.body.protectTitle}'
  AND protectContent = '${req.body.protectContent}';`;
  // console.log('/api/delProtect sql:', sql);
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delProtect err:', err);
      return res.status(500).json({
        code: 500,
        message: '操作数据失败'
      });
    };
    console.log(results.affectedRows)
    if(results.affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '删除成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除失败'
      });
      res.end();
    }
  });
});


module.exports = router;