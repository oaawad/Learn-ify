const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Title cannot be blank'],
  },
  color: {
    type: String,
    required: [true, 'Please Enter a color'],
  },
});

module.exports = mongoose.model('Subject', SubjectSchema);
