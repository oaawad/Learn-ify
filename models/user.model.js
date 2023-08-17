const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email cannot be blank'],
    unique: true,
  },
  password: {
    type: String,
  },
  bio: {
    type: String,
  },
  profession: {
    type: String,
  },
  rating: {
    type: Number,
  },
  country: {
    type: String,
  },
  type: {
    type: String,
    enum: ['individual', 'instructor', 'administrator', 'corporate'],
    default: 'individual',
    required: [true, 'Password cannot be blank'],
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
  subjects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    },
  ],
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
  ],
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  ],
  wallet: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// delete courses when a user is deleted
UserSchema.pre('remove', async function (next) {
  await this.model('Course').deleteMany({ instructor: this._id });
  await this.model('Review').deleteMany({ instructor: this._id });
  await this.model('Review').deleteMany({ user: this._id });
  next();
});

module.exports = mongoose.model('User', UserSchema);
