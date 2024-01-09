const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please username is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please password is required'],
    },
    is_online: {
      type: String,
      default: '0',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// userSchema.pre('save', )
