const express = require('express');
const router = express.Router();
const {
  getGroceryList,
  addGroceryItem,
  updateGroceryItem,
  deleteGroceryItem
} = require('../controllers/groceryController');

// Get all grocery items
router.get('/', getGroceryList);

// Add new grocery item
router.post('/', addGroceryItem);

// Update grocery item
router.put('/:id', updateGroceryItem);

// Delete grocery item
router.delete('/:id', deleteGroceryItem);

module.exports = router; 