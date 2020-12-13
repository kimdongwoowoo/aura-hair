const mongoose = require('mongoose');
// Define Schemes
const customerSchema = new mongoose.Schema({
  name : { type: String, required: true },
  phone : { type: String, required: true },
  address : { type: String, default:"" },
  vip : { type: String, default:"없음" },
  point : { type: Number, default:0 },
  memo : { type: String, default:"" }
},
{
  timestamps: true
});

// Create new customer document
customerSchema.statics.create = function (payload) {
  // this === Model
  const customer = new this(payload);
  // return Promise
  return customer.save();
};

// Find All
customerSchema.statics.findAll = function (keyword) {
  // return promise
  // V4부터 exec() 필요없음
  if(keyword){
    return this.find().or([{name:{$regex:keyword}},{phone:{$regex:keyword}}]);
  }else{
    return this.find({});
  }
    
};

// Find One by customer id
customerSchema.statics.findOneById = function (_id) {
  return this.findOne({ _id });
};

// Update by customer id
customerSchema.statics.updateById = function (_id, payload) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ _id }, payload, { new: true });
};

// Delete by id
customerSchema.statics.deleteById = function (_id) {
  return this.remove({ _id });
};

// Create Model & Export
module.exports = mongoose.model('customer', customerSchema);