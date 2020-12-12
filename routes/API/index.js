var express = require('express');
var router = express.Router();
var customerRouter = require('./customer');
var productRouter = require('./product');
var salesRouter = require('./sales');
var scheduleRouter = require('./schedule');
/* GET home page. */
// /api/
router.get('/', function(req, res, next) {
  res.send('index');
});
router.use('/customer',customerRouter);
router.use('/product',productRouter);
router.use('/sales',salesRouter);
router.use('/schedule',scheduleRouter);
module.exports = router;
