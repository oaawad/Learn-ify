const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LectureSchema = new Schema({
  title: {
    type: String,
    required: [true, `Lecture's title cannot be blank`],
  },
  duration: {
    type: Number,
    required: [true, `Lecture's duration cannot be blank`],
  },
  url: {
    type: String,
    required: [true, `Lecture's url cannot be blank`],
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
});
module.exports = mongoose.model('Lecture', LectureSchema);
