const dbpool = require("../config/dbpoolConfig"); // 引入连接池配置文件
const fileController = {
  uploadFile(req, res) { // 单文件上传
    console.log(req.file.filename);
    var serverPath = 'http://127.0.0.1:8186/';
    let pathName = "uploads/" + req.file.filename; // 路径名
    let fileName = (req.file.originalname).split(".")[0]; // 文件名
    let fileType = (req.file.originalname).split(".")[1]; // 文件名
    dbpool.connect("insert into file_url values (?,?,?)", // mysql语句，存入数据库
      [null, fileName, pathName],// 数据库中file_url表格有三列，第一列为自增，所以写null
      (err, data) => {
        if(!err) {
          let infoData = {
            url: serverPath + pathName,
            fileName: fileName,
            fileType: fileType
          }
          res.status(200).json ({
            code: 200,
            data: infoData,
            message: '文件上传成功！'
          });
          res.end();
        } else {
          res.status(200).json ({
            code: 100,
            message: '文件上传失败！'
          });
          res.end();
        }
    })
  },
  uploadFiles(req, res) { // 多文件上传
    console.log(req);
    for(let i = 0; i < req.files.length; i++) {
      let pathName = "uploads/" + req.files[i].filename; // 路径名
      let fileName = (req.files[i].originalname).split(".")[0]; // 文件名
      dbpool.connect("insert into file_url values (?,?,?)", // mysql语句，存入数据库
        [null, fileName, pathName], // 数据库中file_url表格有三列，第一列为自增，所以写null
        (err, data) => {
          console.log(data);
          // console.log(err);
          if (!err) {
            if (i == req.files.length-1){
              res.status(200).json ({
                code: 200,
                message: '文件上传成功！'
              });
              res.end();
            }
          } else {
            res.status(200).json ({
              code: 100,
              message: '文件上传失败！'
            });
            res.end();
          }
      })
    }
  }
};

module.exports = fileController;