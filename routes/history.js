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
  console.log('/api/addHistory 参数', req.body);
  console.log('/api/addHistory sql:', inset_sql);
  console.log();
  connection.query(inset_sql,(err, result) =>{
    if(err){
      console.log('/api/addHistory err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      console.log('insert result.affectedRows:', result.affectedRows);
      if (result.affectedRows) {
        res.status(200).json ({
          code: 200,
          message: '添加成功'
        });
        res.end();
      } else {
        res.status(200).json ({
          code: 0,
          message: '记录已存在'
        });
        res.end();
      }
    };
  });
});

module.exports = router;
