const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromotionSchema = new Schema({
  amount: {
    type: Number,
    required: [true, 'Please Enter a Promotion Amount'],
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please Enter a Course ID'],
  },
  coupon: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please Enter a User ID'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },

  expireAt: {
    type: Date,
    default: Date.now,
  },
});

// delete promotion from course when a promotion is deleted
PromotionSchema.pre('remove', async function (next) {
  await this.model('Course').updateMany(
    { promotion: this._id },
    { promotion: null },
    { multi: true }
  );
  next();
});

module.exports = mongoose.model('Promotion', PromotionSchema);
