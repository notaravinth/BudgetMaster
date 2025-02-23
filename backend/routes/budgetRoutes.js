const express = require('express');
const router = express.Router();
const {
  getBudgets,
  addBudget,
  updateBudget
} = require('../controllers/budgetController');

// Get all budgets
router.get('/', getBudgets);

// Add new budget
router.post('/', addBudget);

// Update budget
router.put('/:id', updateBudget);

module.exports = router; 