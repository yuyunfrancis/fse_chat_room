const express = require('express');
const userController = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');

// ROUTES
const router = express.Router();

router.route('/register').post(userController.registerUser);

router.route('/login').post(userController.loginUser);

router.route('/current').get(validateToken, userController.getCurrentUser);

module.exports = router;
