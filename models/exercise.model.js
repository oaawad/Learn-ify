const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  title: {
    type: String,
    required: [true, `Exercise's title cannot be blank`],
  },
  description: {
    type: String,
    required: [true, `Exercise's description cannot be blank`],
  },
  duration: {
    type: Number,
    required: [true, `Exercise's duration cannot be blank`],
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
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
});
module.exports = mongoose.model('Exercise', ExerciseSchema);
