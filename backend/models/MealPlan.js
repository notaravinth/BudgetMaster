const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  }
});

const mealPlanSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  meals: [mealSchema],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient date-based queries
mealPlanSchema.index({ date: 1 });

module.exports = mongoose.model('MealPlan', mealPlanSchema); 