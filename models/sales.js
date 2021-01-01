const mongoose = require('mongoose');
// Define Schemes
const salesSchema = new mongoose.Schema({
  customerInfo:{
    _id:{type:String,},
    name:{type:String},
    phone:{type:String}
  },
  productInfo:{
    _id:{type:String},
    name:{type:String}
  },
  price:{type:Number,required:true},
  discountType:{type:Number,required:true},
  discountValue:{type:Number,required:true},
  pointUse:{type:Number,required:true},
  fee:{type:Number,required:true},
  date:{type: String, required: true },
  time:{type: String, required: true },
  memo : { type: String, default:"" }
},
{
  timestamps: true
});

// Create new sales document
salesSchema.statics.create = function (payload) {
  // this === Model
  const sales = new this(payload);
  // return Promise
  return sales.save();
};

// Find All
salesSchema.statics.findAll = function (keyword) {
  // return promise
  // V4부터 exec() 필요없음
  if(keyword){
    return this.find({"customerInfo._id":keyword});
  }else{
    return this.find({});
  }
};

// Find One by sales id
salesSchema.statics.findOneById = function (_id) {
  return this.findOne({ _id });
};

// Update by sales id
salesSchema.statics.updateById = function (_id, payload) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ _id }, payload, { new: true });
};

// Delete by id
salesSchema.statics.deleteById = function (_id) {
  return this.remove({ _id });
};

// Create Model & Export
module.exports = mongoose.model('sales', salesSchema);