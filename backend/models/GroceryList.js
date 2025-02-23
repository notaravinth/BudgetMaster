const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Produce', 'Dairy', 'Meat', 'Pantry', 'Other'],
    default: 'Other'
  },
  completed: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    enum: ['manual', 'recipe', 'low-stock'],
    default: 'manual'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GroceryItem', groceryItemSchema); 