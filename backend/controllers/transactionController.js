const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new transaction
const addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();

    // Update budget spent amount if it's an expense
    if (transaction.type === 'expense') {
      const budget = await Budget.findOne({ category: transaction.category });
      if (budget) {
        budget.spent += transaction.amount;
        await budget.save();
      }
    }

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get transactions report
const getTransactionsReport = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1)); // Default to month
    }

    const transactions = await Transaction.find({
      date: { $gte: startDate }
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  getTransactionsReport
}; 