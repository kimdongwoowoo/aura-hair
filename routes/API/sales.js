//참조: https://velog.io/@smooth97/Node.js-Restful-API-wok2wqo7yu
//장부 관련 api (ajax호출용), URL : /sales
var express = require('express');
var router = express.Router();
var salesList=[];
router.use(express.json());

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

router.post('/', (req, res, next) =>{
  var sales=req.body;
  sales.id=salesList.length+1;
  salesList.push(sales);  
  res.send(sales);
  
});

router.delete("/:id", (req, res) => {
  for(var i=0;i<salesList.length;++i){

    if(salesList[i].id==parseInt(req.params.id)){
      salesList.splice(i, 1)
      break;
    }
  }
});

router.put("/:id", (req, res) => {
  var sales;
  var target;
  for(var i=0;i<salesList.length;++i){

    if(salesList[i].id==parseInt(req.params.id)){
      target=salesList[i];
      break;
    }
    
  }
  if(sales){
    var updateSales={
      id:sales.id, //업데이트할 sales id
      customerId:req.body.customerId,
      productId:req.body.productId,
      price:req.body.price,
      discountType:req.body.discountType,
      discountValue:req.body.discountValue,
      pointUse:req.body.pointUse,
      fee:req.body.fee,
      date:req.body.date,
      memo:req.body.memo,
      
  
    }
    sales=updateSales;
    res.send(sales);
  }else{
    res.status(404).send('ID was not found');
  }    
});
// id로 조회
router.get("/:id", (req, res) => {
  const sales = salesList.find(c => c.id === parseInt(req.params.id));
  if (!sales) res.status(404).send('ID was not found');
  res.send(sales);
});

module.exports = router;
