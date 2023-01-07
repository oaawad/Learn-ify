const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseRequestSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'CorporateStudent',
  },
  corporate: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('CourseRequest', courseRequestSchema);
