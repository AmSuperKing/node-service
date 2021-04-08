// 使用mysql中间件连接MySQL数据库
var mysql = require('mysql');
var mysql_connection = mysql.createConnection({
    host:'127.0.0.1',       // 数据库地址
    user: 'root',       // 用户名
    password: 'root',       // 密码
    port : '3306',      // 端口
    database: 'db_onlinelearn',     // 库名
    multipleStatements: true,        // 允许执行多条语句
    timezone:'Asia/Shanghai'    // 设置时间区
});

module.exports.mysql_connection = mysql_connection;