//참조: https://velog.io/@smooth97/Node.js-Restful-API-wok2wqo7yu
//장부 관련 api (ajax호출용), URL : /sales
var express = require('express');
var router = express.Router();
var salesList=[
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
//전화번호, 이름으로 검색
function fnSearchSales(keyword){
  var resultList=[];
  for(var i=0;i<salesList.length;++i){
    console.log(i);
    if(salesList[i].name.indexOf(keyword)!==-1 || salesList[i].phone.indexOf(keyword)!==-1 ){
      resultList.push(salesList[i]);
    }
  }
  return resultList;
}
// /api/sales
// GET 
// 리스트
router.get('/', (req, res, next) =>{
  var keyword=req.query.keyword;
  if(keyword){
    var resultList;
    resultList=fnSearchSales(keyword);
    res.send(resultList);
    
  }
  else{
    res.send(salesList);
  }
  
});

// id로 조회
router.get("/:id", (req, res) => {
  const sales = salesList.find(c => c.id === parseInt(req.params.id));
  if (!sales) res.status(404).send('ID was not found');
  res.send(sales);
});

router.post('/', (req, res, next) =>{
  var sales={
    id:salesList.length+1,
    name:req.body.name,
    phone:req.body.phone,
    address:req.body.address,
    vip:req.body.vip,
    point:req.body.point,
    //lastVisit:-1,
    memo:req.body.memo,

  }

  salesList.push(sales);

  
  res.send(sales);
});

router.put("/:id", (req, res) => {
  var sales;
  for(var i=0;i<salesList.length;++i){

    if(salesList[i].id==parseInt(req.params.id)){
      sales=salesList[i];
      break;
    }
    
  }
  if(sales){     
    sales.name=req.body.name;
    sales.phone=req.body.phone;
    sales.address=req.body.address;
    sales.vip=req.body.vip;
    sales.point=req.body.point;
    sales.memo=req.body.memo;
    res.send(sales);
  }else{
    res.status(404).send('ID was not found');
  }    
});

module.exports = router;
