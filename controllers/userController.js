const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

exports.showRegisterForm = async (req, res) => {
  try {
    console.log('Rendering register.ejs');
    res.render('register');
  } catch (err) {
    console.log(err.message);
  }
};

exports.showLoginForm = async (req, res) => {
  try {
    console.log('Rendering login.ejs');
    res.render('login');
  } catch (err) {
    console.log(err.message);
  }
};

//@desc register a new user
//@route POST /api/v1/users/register
//@access Public

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  // Check if user exists
  const isUserAvailable = await User.findOne({ name });

  if (isUserAvailable) {
    res.status(400);
    throw new Error('User with this username already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    password: hashedPassword,
  });

  if (user) {
    // res.status(201).json({
    //   status: 'success',
    //   data: {
    //     user,
    //   },
    // });
    res.render('register', { message: 'User created successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//@desc login a user
//@route POST /api/v1/users/login
//@access Public
exports.loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400);
    throw new Error('Please fill all fields');
  }
  const user = await User.findOne({ name });

  //check if user exists and compare password
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.status(400);
    res.render('login', { message: 'Invalid username or password' });
  }
});

//@desc get current logged in user
//@route GET /api/v1/users/current
//@access Private
exports.getCurrentUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
};

exports.showDashboad = async (req, res) => {
  try {
    let users = await User.find({ _id: { $nin: [req.session.user._id] } });
    res.render('dashboard', { user: req.session.user, users: users });
  } catch (err) {
    console.log(err.message);
  }
};

exports.saveChat = async (req, res) => {
  try {
    var chat = new Chat({
      sender_id: req.body.sender_id,
      receiver_id: req.body.receiver_id,
      message: req.body.message,
    });

    var newChat = await chat.save();
    res
      .status(201)
      .send({
        success: true,
        message: 'chat saved successfully',
        data: newChat,
      });
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};

//@desc logout user
//@route GET /api/v1/users/logout
//@access Private
exports.logoutUser = asyncHandler(async (req, res) => {
  try {
    const expiredToken = jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 1,
    });

    res.cookie('token', expiredToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1),
      secure: process.env.NODE_ENV === 'production',
    });

    req.session.destroy();
    res.redirect('/login');
  } catch (err) {
    console.log(err.message);
  }
});
