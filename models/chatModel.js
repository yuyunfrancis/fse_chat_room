const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: [true, 'Please message is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
