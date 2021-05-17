var createError = require('http-errors');
var express = require('express'); // 加载express模块
var cors = require('cors');
var path = require('path'); // 路径模块
// 这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象
var cookieParser = require('cookie-parser');
// 引入处理post数据的模块
const bodyParser = require("body-parser");
var logger = require('morgan'); // 在控制台中，显示req请求的信息

// 引入插件
var vertoken = require('./token/token');
var expressJwt = require('express-jwt');

var homeRouter = require('./routes/home');
var user = require('./routes/user');
var index = require('./routes/index');
var documentRouter = require('./routes/document');
var video = require('./routes/video');
var history = require('./routes/history');
var ebook = require('./routes/ebook');
var about = require('./routes/about');
var course = require('./routes/course');
var discuss = require('./routes/discuss');
var userCenter = require('./routes/userCenter')

const fileRouter = require('./routes/fileRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//使用处理post请求的模块
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/upload', fileRouter);
app.use('/', homeRouter);
app.use('/api', user, index, documentRouter, video, history, ebook, about, course, discuss, userCenter);

//解析token获取用户信息
app.use(function(req, res, next) {
  var token = req.headers['authorization'];
  if(token == undefined) {
    return next();
  } else {
    vertoken.getToken(token).then((data) => {
      req.data = data;
      return next();
    }).catch((error) => {
      return next();
    })
  }
});

//验证token是否过期并规定那些路由不需要验证
app.use(expressJwt({
  secret:'online_learn_token',
  algorithms:['HS256']
}).unless({
  path:['/', '/api', '/upload']  // 不需要验证的接口名称
}));

// token失效返回信息
app.use(function(err, req, res, next) {
  if(err.status == 401) {
      // return res.status(401).send('token失效')
      // 可以设置返回json 形式  res.json({message:'token失效'})
      return res.status(401).json({ message: 'token失效' })
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  res.locals.message = '请求出错啦~'
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // res.redirect('/404');
});

module.exports = app;
