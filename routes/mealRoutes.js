const express = require('express');
const authController = require('./../controllers/authController');
const mealController = require('./../controllers/mealController');
const router = express.Router();

router
  .route('/details/:id')
  .get(authController.protect, mealController.getMealInfo);

router.route('/myMeal').get(authController.protect, mealController.getMyMeal);
router
  .route('/addTemplate/:id')
  .post(authController.protect, mealController.addMealTemplate);

router
  .route('/clearMeal')
  .get(authController.protect, mealController.deleteMeal);

router.route('/').get(authController.protect, mealController.getAllMeals);

module.exports = router;
