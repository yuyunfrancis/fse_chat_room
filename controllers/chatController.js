const Chat = require('../models/chatModel');
const asyncHandler = require('express-async-handler');

exports.saveChat = async (req, res) => {
  try {
    var chat = new Chat({
      sender_id: req.body.sender_id,
      message: req.body.message,
    });

    var newChat = await chat.save();
    res.status(201).send({
      success: true,
      message: 'chat saved successfully',
      data: newChat,
    });
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};

exports.getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({})
    .populate('sender_id', 'name')
    .sort({ createdAt: 1 });
  res.status(200).json({
    success: true,
    data: chats,
  });
});
