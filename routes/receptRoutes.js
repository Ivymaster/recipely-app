const express = require('express');
const authController = require('./../controllers/authController');
const receptController = require('./../controllers/receptController');

const router = express.Router();
router
  .route('/mojiRecepti')
  .get(
    authController.protect,
    authController.isLoggedIn,
    authController.restrictTo('user', 'admin'),
    receptController.showUsersRecepts
  );
router
  .route('/:id')
  .get(receptController.getReceptInfo)
  .post(
    authController.isLoggedIn,
    authController.restrictTo('user', 'admin'),
    receptController.saveRecept,
    receptController.updateRecept
  )
  .delete(
    authController.isLoggedIn,
    authController.restrictTo('user', 'admin'),
    receptController.deleteRecept,
    receptController.updateRecept
  );
router
  .route('/savedRecept/:id')
  .get(authController.protect, receptController.getReceptChangeForm)
  .post(
    authController.protect,
    authController.isLoggedIn,
    receptController.saveReceptChanges,
    receptController.updateRecept
  );

router
  .route('/')
  .get(authController.isLoggedIn, receptController.getRecepts)
  .post(authController.isLoggedIn, receptController.searchSpecificRecepts);

module.exports = router;
