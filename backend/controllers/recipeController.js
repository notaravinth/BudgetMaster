const Recipe = require('../models/Recipe');

// Get all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search recipes by ingredients
const searchRecipesByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    const recipes = await Recipe.find({
      'ingredients.name': { 
        $in: ingredients.map(ing => new RegExp(ing, 'i')) 
      }
    });

    // Calculate match percentage for each recipe
    const recipesWithMatches = recipes.map(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
      const matchedIngredients = ingredients.filter(ing => 
        recipeIngredients.some(rIng => rIng.includes(ing.toLowerCase()))
      );
      
      return {
        ...recipe._doc,
        matchPercentage: (matchedIngredients.length / recipe.ingredients.length) * 100,
        matchedIngredients,
        missingIngredients: recipe.ingredients
          .filter(ing => !ingredients.some(i => 
            ing.name.toLowerCase().includes(i.toLowerCase())
          ))
          .map(ing => ing.name)
      };
    });

    // Sort by match percentage
    recipesWithMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(recipesWithMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new recipe
const addRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getRecipes,
  searchRecipesByIngredients,
  addRecipe
}; 