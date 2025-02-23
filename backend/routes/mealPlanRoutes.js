const express = require('express');
const router = express.Router();
const {
  getMealPlans,
  addMeal,
  updateMeal,
  deleteMeal
} = require('../controllers/mealPlanController');

// Get meal plans for a date range
router.get('/', getMealPlans);

// Add meal to a specific date
router.post('/meal', addMeal);

// Update specific meal in a meal plan
router.put('/:mealPlanId/meal/:mealId', updateMeal);

// Delete specific meal from a meal plan
router.delete('/:mealPlanId/meal/:mealId', deleteMeal);

module.exports = router; 