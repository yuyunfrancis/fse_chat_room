const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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
    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
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
    const accessToken = jwt.sign(
      {
        user: {
          id: user._id,
          name: user.name,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30d' }
    );
    res.status(200).json({
      status: 'success',
      data: {
        user,
        accessToken,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid username or password');
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
