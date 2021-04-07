var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Index' });
  res.send('Welcome to Index page.');
});

module.exports = router;
