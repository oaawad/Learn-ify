const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  rating: {
    type: Number,
    required: [true, 'Please Enter a Rating'],
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please Enter a User ID'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  body: {
    type: String,
  },
});

// delete reviews when a course or user is deleted
ReviewSchema.pre('remove', async function (next) {
  await this.model('Course').updateMany(
    { reviews: this._id },
    { $pull: { reviews: this._id } },
    { multi: true }
  );
  await this.model('User').updateMany(
    { reviews: this._id },
    { $pull: { reviews: this._id } },
    { multi: true }
  );
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);
