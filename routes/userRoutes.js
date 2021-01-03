const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.isLoggedIn, authController.login);
router.get('/logout', authController.logout);

router.get('/forgotPassword', (req, res) => {
  res.render('forgotPass');
});
router.post('/forgotPassword', authController.forgotPassword);
router.route('/resetPassword/:token').get((req, res) => {
  res.render('newPass', {
    token: req.params.token
  });
});

router.post('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);

router.post(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.post(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
