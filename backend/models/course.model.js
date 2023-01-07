const mongoose = require('mongoose');
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
  subtitles: [
    new Schema({
      sTitle: {
        type: String,
        required: [true, 'Title cannot be blank'],
      },
      lessons: [
        {
          video:
            new Schema({
              title: {
                type: String,
                required: [true, 'Title cannot be blank'],
              },
              duration: {
                type: Number,
                required: [true, 'Please Enter a Video Duration'],
              },
              url: {
                type: String,
              },
            }) || null,
          exercise:
            new Schema({
              title: {
                type: String,
                required: [true, 'Title cannot be blank'],
              },
              description: {
                type: String,
              },
              questions: [
                {
                  question: {
                    type: String,
                    required: [true, 'Please Enter a Question'],
                  },
                  answers: [
                    {
                      type: String,
                      required: [true, 'Please Enter a Answer'],
                    },
                  ],
                  correctAnswer: {
                    type: Number,
                    required: [true, 'Please Enter a Correct Answer'],
                  },
                },
              ],
            }) || null,
        },
      ],
    }),
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
  // status: ['public', 'draft''],
  status: {
    type: String,
    enum: ['public', 'draft'],
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
CourseSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ course: this._id });
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
