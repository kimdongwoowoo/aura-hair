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
    point:"50000",
    memo:"abc"
  },
  {
    id:2,
    name:"고객2",
    phone:"010-4211-6666",
    address:"2단지",
    vip:"GOLD",
    point:"1000000",
    memo:"def"
  }
]
//전화번호, 이름으로 검색
function fnSearchCustomer(keyword){
  var resultList=[];
  for(var i=0;i<customerList.length;++i){
    console.log(i);
    if(customerList[i].name.indexOf(keyword)!==-1 || customerList[i].phone.indexOf(keyword)!==-1 ){
      resultList.push(customerList[i]);
    }
  }
  return resultList;
}
// /api/customer
// GET 
// 리스트
router.get('/', (req, res, next) =>{
  var keyword=req.query.keyword;
  if(keyword){
    var resultList;
    resultList=fnSearchCustomer(keyword);
    res.send(resultList);
    
  }
  else{
    res.send(customerList);
  }
  
});

// id로 조회
router.get("/:id", (req, res) => {
  const customer = customerList.find(c => c.id === parseInt(req.params.id));
  if (!customer) res.status(404).send('회원없음');
  res.send(customer);
});

router.post('/', (req, res, next) =>{
  var customer={
    id:customerList.length+1,
    name:req.body.name,
    phone:req.body.phone,
    address:req.body.address,
    vip:req.body.vip,
    point:req.body.point,
    memo:req.body.memo,

  }

  customerList.push(customer);

  
  res.send(customer);
});

router.put("/:id", (req, res) => {
  var customer;
  for(var i=0;i<customerList.length;++i){

    if(customerList[i].id==parseInt(req.params.id)){
      customer=customerList[i];
      break;
    }
    
  }
  if(customer){
    if(req.body.name)
      customer.name=req.body.name;
    if(req.body.phone)
      customer.phone=req.body.phone;
    if(req.body.address)
      customer.address=req.body.address;
    if(req.body.vip)
      customer.vip=req.body.vip;
    if(req.body.point)
      customer.point=req.body.point;
    if(req.body.memo)
      customer.memo=req.body.memo;
    res.send(customer);
  }else{
    res.status(404).send('ID was not found');
  }    
});
router.delete("/:id",(req,res)=>{
  var customer;
  for (var i = 0; i < customerList.length; ++i) {
    if (customerList[i].id == parseInt(req.params.id)) {
      customer = customerList[i];
      customerList.splice(i, 1);
      break;
    }
  }
  res.send(customer);
});

module.exports = router;
