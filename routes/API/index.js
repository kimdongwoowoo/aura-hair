var express = require('express');
var router = express.Router();
var customerRouter = require('./customer');
var productRouter = require('./product');
var salesRouter = require('./sales');
/* GET home page. */
// /api/
router.get('/', function(req, res, next) {
  res.send('index');
});
router.use('/customer',customerRouter);
router.use('/product',productRouter);
router.use('/sales',salesRouter);
module.exports = router;
