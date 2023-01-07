const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User' || 'CorporateStudent',
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    type: {
      type: String,
      enum: ['refund', 'technical', 'financial', 'other'],
      default: 'refund',
    },
    status: {
      type: String,
      enum: ['unseen', 'pending', 'resolved', 'closed'],
      default: 'unseen',
    },
    subject: {
      type: String,
    },
    messages: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User' || 'CorporateStudent',
        },
        message: {
          type: String,
        },
        date: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);
