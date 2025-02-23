const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Get all budgets
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new budget
const addBudget = async (req, res) => {
  try {
    // Check if budget for category already exists
    const existingBudget = await Budget.findOne({ category: req.body.category });
    if (existingBudget) {
      return res.status(400).json({ message: 'Budget for this category already exists' });
    }

    const budget = new Budget(req.body);
    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update budget
const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(updatedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getBudgets,
  addBudget,
  updateBudget
}; 