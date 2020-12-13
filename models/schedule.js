const mongoose = require('mongoose');
// Define Schemes
const scheduleSchema = new mongoose.Schema({
  title:{type:String,required:true},
  start:{type:String,default:""},
  end:{type:String,default:""},
  allDay:{type:Boolean}

},
{
  timestamps: true
});

// Create new schedule document
scheduleSchema.statics.create = function (payload) {
  // this === Model
  const schedule = new this(payload);
  // return Promise
  return schedule.save();
};

// Find All
scheduleSchema.statics.findAll = function () {
  // return promise
  // V4부터 exec() 필요없음
  return this.find({});
};

// Find One by schedule id
scheduleSchema.statics.findOneById = function (_id) {
  return this.findOne({ _id });
};

// Update by schedule id
scheduleSchema.statics.updateById = function (_id, payload) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ _id }, payload, { new: true });
};

// Delete by id
scheduleSchema.statics.deleteById = function (_id) {
  return this.remove({ _id });
};

// Create Model & Export
module.exports = mongoose.model('schedule', scheduleSchema);