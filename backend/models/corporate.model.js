const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CorporateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  accountsLimit: {
    type: Number,
    required: true,
  },
  coursesLimit: {
    type: Number,
    required: true,
  },
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CorporateStudent',
    },
  ],
  coursesNumber: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Corporate', CorporateSchema);
