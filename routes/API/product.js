//참조: https://velog.io/@smooth97/Node.js-Restful-API-wok2wqo7yu
//제품 api (ajax호출용), URL : /product
var express = require('express');
var router = express.Router();
const Product = require('../../models/product');
/*
var productList=[
  {
    id:1,
    class:"분류없음",
    name:"시그니처펌",
    price:55000,
    memo:"memo1"
  },
  {
    id:2,
    class:"남자펌",
    name:"호일펌",
    price:150000,
    memo:"memo2"
  }
]
//이름으로 검색
function fnSearchProduct(keyword){
  var resultList=[];
  for(var i=0;i<productList.length;++i){
    console.log(i);
    if(productList[i].name.indexOf(keyword)!==-1){
      resultList.push(productList[i]);
    }
  }
  return resultList;
}
// /api/product
// GET 
// 리스트
router.get('/', (req, res, next) =>{
  var keyword=req.query.keyword;
  if(keyword){
    var resultList;
    resultList=fnSearchProduct(keyword);
    res.send(resultList);
    
  }
  else{
    res.send(productList);
  }
  
});

// id로 조회
router.get("/:id", (req, res) => {
  const product = productList.find(c => c.id === parseInt(req.params.id));
  if (!product) res.status(404).send('ID was not found');
  res.send(product);
});

router.post('/', (req, res, next) =>{
  var product={
    id:productList.length+1,
    class:req.body.class,
    name:req.body.name,
    price:req.body.price,
    memo:req.body.memo,

  }

  productList.push(product);

  
  res.send(product);
});

router.put("/:id", (req, res) => {
  var product;
  for(var i=0;i<productList.length;++i){

    if(productList[i].id==parseInt(req.params.id)){
      product=productList[i];
      break;
    }
    
  }
  if(product){
    product.class=req.body.class;
    product.name=req.body.name;
    product.price=req.body.price;
    product.memo=req.body.memo;
    res.send(product);
  }else{
    res.status(404).send('ID was not found');
  }    
});
router.delete("/:id",(req,res)=>{
  var product;
  for (var i = 0; i < productList.length; ++i) {
    if (productList[i].id == parseInt(req.params.id)) {
      product = productList[i];
      productList.splice(i, 1);
      break;
    }
  }
  res.send(product);
});
*/

// Find All
router.get('/', (req, res) => {
  Product.findAll(req.query.keyword)
    .then((product) => {
      if (!product.length) return res.send([]);
      res.send(product);
    })
    .catch(err => res.status(500).send(err));
});

// Find One by id
router.get('/:id', (req, res) => {
  Product.findOneById(req.params.id)
    .then((product) => {
      if (!product) return res.status(404).send({ err: 'product not found' });
      res.send(product);
    })
    .catch(err => res.status(500).send(err));
});

// Create new
router.post('/', (req, res) => {
  Product.create(req.body)
    .then(product => res.send(product))
    .catch(err => res.status(500).send(err));
});

// Update by id
router.put('/:id', (req, res) => {
  Product.updateById(req.params.id, req.body)
    .then(product => res.send(product))
    .catch(err => res.status(500).send(err));
});

// Delete by id
router.delete('/:id', (req, res) => {
  Product.deleteById(req.params.id)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
