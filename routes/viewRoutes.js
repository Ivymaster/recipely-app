const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/about', authController.isLoggedIn, viewsController.getAbout);
router.get('/contact', authController.isLoggedIn, viewsController.getContact);
router.get('/signup', viewsController.getSignUpForm);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/logout', authController.isLoggedIn, authController.logout);
router.post(
  '/contactMail',
  authController.isLoggedIn,
  viewsController.sendContactMail
);

router.get(
  '/me',
  authController.isLoggedIn,
  authController.protect,
  userController.sendProfile
);
router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

router.all('*', (req, res, next) => {
  next(new AppError(`Nemoguce pronaci ${req.originalUrl} na serveru!`, 404));
});

module.exports = router;
