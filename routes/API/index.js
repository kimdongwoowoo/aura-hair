var express = require('express');
var router = express.Router();
var customerRouter = require('./customer');
/* GET home page. */
// /api/
router.get('/', function(req, res, next) {
  res.send('index');
});
router.use('/customer',customerRouter);


module.exports = router;
