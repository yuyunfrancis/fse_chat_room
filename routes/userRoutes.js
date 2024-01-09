const express = require('express');
const userController = require('../controllers/userController');

// ROUTES
const router = express.Router();

router.route('/register').post(userController.registerUser);

router.route('/login').post(userController.loginUser);

// router.route('/current').get(userController.getCurrentUser);

module.exports = router;
