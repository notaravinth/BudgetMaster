const MealPlan = require('../models/MealPlan');

// Get meal plans for a date range
const getMealPlans = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const mealPlans = await MealPlan.find(query)
      .populate('meals.recipe')
      .sort({ date: 1 });
    
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add meal to a specific date
const addMeal = async (req, res) => {
  try {
    const { date } = req.body;
    
    let mealPlan = await MealPlan.findOne({ date: new Date(date) });
    
    if (!mealPlan) {
      mealPlan = new MealPlan({
        date: new Date(date),
        meals: []
      });
    }
    
    mealPlan.meals.push(req.body.meal);
    const savedMealPlan = await mealPlan.save();
    
    const populatedMealPlan = await MealPlan.findById(savedMealPlan._id)
      .populate('meals.recipe');
    
    res.status(201).json(populatedMealPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update meal
const updateMeal = async (req, res) => {
  try {
    const { mealPlanId, mealId } = req.params;
    
    const mealPlan = await MealPlan.findById(mealPlanId);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    
    const mealIndex = mealPlan.meals.findIndex(meal => meal._id.toString() === mealId);
    if (mealIndex === -1) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    mealPlan.meals[mealIndex] = { ...mealPlan.meals[mealIndex], ...req.body };
    await mealPlan.save();
    
    const updatedMealPlan = await MealPlan.findById(mealPlanId)
      .populate('meals.recipe');
    
    res.json(updatedMealPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete meal
const deleteMeal = async (req, res) => {
  try {
    const { mealPlanId, mealId } = req.params;
    
    const mealPlan = await MealPlan.findById(mealPlanId);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    
    mealPlan.meals = mealPlan.meals.filter(meal => meal._id.toString() !== mealId);
    await mealPlan.save();
    
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMealPlans,
  addMeal,
  updateMeal,
  deleteMeal
}; 