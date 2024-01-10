const express = require('express');
const userController = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');
const auth = require('../middleware/auth');

// ROUTES
const router = express.Router();

router
  .route('/register')
  .get(auth.isLogout, userController.showRegisterForm)
  .post(userController.registerUser);

router
  .route('/login')
  .get(auth.isLogout, userController.showLoginForm)
  .post(userController.loginUser);

router.route('/logout').get(auth.isLogin, userController.logoutUser);

router.route('/').get(auth.isLogin, userController.showDashboad);

router.route('/current').get(validateToken, userController.getCurrentUser);

router.route('/save-chat').post(userController.saveChat);

router.route('*', function (req, res) {
  res.redirect('/');
});

module.exports = router;
