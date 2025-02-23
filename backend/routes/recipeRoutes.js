const express = require('express');
const router = express.Router();
const {
  getRecipes,
  searchRecipesByIngredients,
  addRecipe
} = require('../controllers/recipeController');

router.get('/', getRecipes);
router.post('/search', searchRecipesByIngredients);
router.post('/', addRecipe);

module.exports = router; 