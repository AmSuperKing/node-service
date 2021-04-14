var express = require('express');
var router = express.Router();

/* GET root path listing. */
router.get('/', function(req, res, next) {
  res.send('Please request the correct address');
  res.end();
});

module.exports = router;
