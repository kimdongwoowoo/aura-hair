//참조: https://velog.io/@smooth97/Node.js-Restful-API-wok2wqo7yu
//고객 관련 api (ajax호출용), URL : /customer
var express = require('express');
var router = express.Router();
var customerList=[
  {
    id:1,
    name:"김동우",
    phone:"010-1212-1212",
    address:"3단지",
    vip:"SILVER",
    point:"5126412",
    lastVisit:521123,
    memo:"abc"
  },
  {
    id:2,
    name:"고객2",
    phone:"010-4211-6666",
    address:"2단지",
    vip:"GOLD",
    point:"5125126412",
    lastVisit:612125,
    memo:"def"
  }
]

// /api/customer
// GET 
// 리스트
router.get('/', (req, res, next) =>{
  res.send(customerList);
});

router.post('/', (req, res, next) =>{
  var customer={
    id:customerList.length+1,
    name:req.body.name,
    phone:req.body.phone,
    address:req.body.address,
    vip:req.body.vip,
    point:req.body.point,
    lastVisit:-1,
    memo:req.body.memo,

  }
  customerList.push(customer);

  
  res.send(customer);
});


// id로 조회
/*
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send(`ID was not found`);
  res.send(course);
});
*/
module.exports = router;
