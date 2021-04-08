var createError = require('http-errors');
var express = require('express'); // 加载express模块
var path = require('path'); // 路径模块
// 这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象
var cookieParser = require('cookie-parser');
var logger = require('morgan'); // 在控制台中，显示req请求的信息

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/', usersRouter);

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
