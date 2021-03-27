const mongoose = require('mongoose');
// Define Schemes
const salesSchema = new mongoose.Schema({
  customerInfo:{
    _id:{type:String,default:-1},
    name:{type:String,default:""},
    phone:{type:String,phont:""}
  },
  productInfo:{
    _id:{type:String,default:-1},
    name:{type:String,default:""}
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

    return this.find({});

};
// Find By start,end date
salesSchema.statics.getSalesTotal = function (start,end) {
  return this.aggregate(
    [ 
      { $match : { date : {$gte:start,$lte:end} } } ,
      { $group: {
         _id: "$date", 
         totalSaleAmount: { $sum: { $sum: [ "$fee", "$pointUse" ] }},
         count: {$sum:1} 
        }
      },
      { $sort : {date:1}}
      
    ]
  );
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