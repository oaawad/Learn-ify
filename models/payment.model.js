const mongoose = require('mongoose');
const User = require('./user.model');
const Course = require('./course.model');

const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    status: {
      type: String,
      enum: ['paid', 'refunded'],
      default: 'paid',
    },
    promotion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// delete payment record and course in courses array from user and delete payment record from instructor and remove user from course's students when a payment is deleted
PaymentSchema.post('remove', async function (next) {
  const course = await this.model('Course').findById(this.course);
  const user = await this.model('User').findById(this.user);
  const instructor = await this.model('User').findById(course.instructor);

  course.students = course.students.filter((studentId) => studentId !== user._id);
  user.courses = user.courses.filter((c) => c._id !== course._id);

  instructor.payments = instructor.payments.filter((p) => p !== this._id);
  user.payments = user.payments.filter((p) => p !== this._id);

  await course.save();
  await user.save();
  await instructor.save();
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
