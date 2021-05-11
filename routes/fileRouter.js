const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var cors = require('cors');

// 引入路由模块
const uploadController = require("../controller/uploadController");

// 调用express对象的路由方法来获取路由对象
const router = express.Router();

router.use(cors());
router.use(bodyParser.urlencoded({ extended:false }));
router.use(bodyParser.json());

// 引入处理文件上传的模块
const upload = require("../config/uploadConfig");

//=======================路由拦截=============================

// 单文件上传
router.post("/uploadFile", upload.single("file"), uploadController.uploadFile);

// 多文件上传
router.post("/uploadFiles", upload.array("files"), uploadController.uploadFiles);

// 公开路由模块
module.exports = router;