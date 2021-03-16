//참조: https://velog.io/@smooth97/Node.js-Restful-API-wok2wqo7yu
//장부 관련 api (ajax호출용), URL : /sales
var express = require('express');
var router = express.Router();
const Sales = require('../../models/sales');
//var salesList=[];
router.use(express.json());

/*
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
      salesId:req.body.salesId,
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
router.delete("/:id",(req,res)=>{
  var sales;
  for (var i = 0; i < salesList.length; ++i) {
    if (salesList[i].id == parseInt(req.params.id)) {
      sales = salesList[i];
      salesList.splice(i, 1);
      break;
    }
  }
  res.send(sales);
});
*/
router.get('/', (req, res) => {
  console.log(req.query.start,req.query.end);
  if(req.query.start && req.query.end){
    Sales.getSalesTotal(req.query.start,req.query.end)
    .then((sales) => {
      if (!sales.length) return res.send([]);
      res.send(sales);
    })
    .catch(err => res.status(500).send(err));
  }else{
    Sales.findAll()
      .then((sales) => {
        if (!sales.length) return res.send([]);
        res.send(sales);
      })
      .catch(err => res.status(500).send(err));
  }
});

// Find One by id
router.get('/:id', (req, res) => {
  Sales.findOneById(req.params.id)
    .then((sales) => {
      if (!sales) return res.status(404).send({ err: 'sales not found' });
      res.send(sales);
    })
    .catch(err => res.status(500).send(err));
});

// Create new
router.post('/', (req, res) => {
  Sales.create(req.body)
    .then(sales => res.send(sales))
    .catch(err => res.status(500).send(err));
});
// Update by id
router.put('/:id', (req, res) => {
  Sales.updateById(req.params.id, req.body)
    .then(sales => res.send(sales))
    .catch(err => res.status(500).send(err));
});

// Delete by id
router.delete('/:id', (req, res) => {
  Sales.deleteById(req.params.id)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err));
});
module.exports = router;
