const mongoose = require('mongoose');
// Define Schemes
const productSchema = new mongoose.Schema({
  class : { type: String, required: true },
  name : { type: String, required: true },
  price : { type: Number, required:true },
  memo : { type: String, default:"" }
},
{
  timestamps: true
});

// Create new product document
productSchema.statics.create = function (payload) {
  // this === Model
  const product = new this(payload);
  // return Promise
  return product.save();
};

// Find All
productSchema.statics.findAll = function (keyword) {
  // return promise
  // V4부터 exec() 필요없음
  if(keyword){
    return this.find().regex('name', keyword)
  }
  return this.find({});
};

// Find One by product id
productSchema.statics.findOneById = function (_id) {
  return this.findOne({ _id });
};

// Update by product id
productSchema.statics.updateById = function (_id, payload) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ _id }, payload, { new: true });
};

// Delete by id
productSchema.statics.deleteById = function (_id) {
  return this.remove({ _id });
};

// Create Model & Export
module.exports = mongoose.model('product', productSchema);