const mongoose = require('mongoose');
const Review = require('./review.model');
const Lecture = require('./lecture.model');
const Exercise = require('./exercise.model');
const User = require('../models/user.model');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title cannot be blank'],
  },
  preview: {
    type: String,
    required: [true, 'Please Enter a Preview video URL'],
  },
  description: {
    type: String,
    required: [true, 'Please Enter a course description'],
  },
  price: {
    type: Number,
  },
  sections: [
    {
      title: {
        type: String,
        required: [true, `Section's itle cannot be blank`],
      },
      duration: {
        type: Number,
        required: [true, `Section's duration cannot be blank`],
      },
      lessons: [
        {
          type: {
            type: String,
            enum: ['lecture', 'exercise'],
            required: [true, `Lesson's type cannot be blank`],
          },
          ref: {
            type: Schema.Types.ObjectId,
            ref: 'Lecture' || 'Exercise',
          },
        },
      ],
    },
  ],
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  promotion: {
    type: Schema.Types.ObjectId,
    ref: 'Promotion',
  },
  status: {
    type: String,
    enum: ['public', 'reviewing', 'draft', 'closed'],
    required: [true, 'Please Enter a Status'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  duration: {
    type: Number,
  },
  lessonsCount: {
    type: Number,
    default: 0,
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  studentsCount: {
    type: Number,
    default: 0,
  },
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
// delete reviews when a course is deleted
CourseSchema.post('remove', async function () {
  await Lecture.deleteMany({ course: this._id });
  await Review.deleteMany({ course: this._id });
  await Exercise.deleteMany({ course: this._id });
  await User.updateMany(
    { courses: { $elemMatch: { _id: this._id } } },
    { $pull: { courses: { _id: this._id } } }
  );
});

module.exports = mongoose.model('Course', CourseSchema);
