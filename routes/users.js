var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is get /user respond to you.');
});
router.get('/login', function(req, res, next) {
  res.send('This is get /user/login respond to you.');
});

module.exports = router;
