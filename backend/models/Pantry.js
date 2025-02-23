const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Dry Goods', 'Spices', 'Dairy', 'Produce', 'Meat', 'Other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  expirationDate: {
    type: Date
  },
  lowStockThreshold: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PantryItem', pantryItemSchema); 