const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CorporateStudentSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  corporate: {
    type: Schema.Types.ObjectId,
    ref: 'Corporate',
  },
  courses: [
    {
      _id: { type: Schema.Types.ObjectId, ref: 'Course' },
      watchedLessons: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Lesson',
        },
      ],
      watchedDuration: {
        type: Number,
        default: 0,
      },
      completed: {
        type: String,
      },
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  requests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CourseRequest',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CorporateStudent', CorporateStudentSchema);
