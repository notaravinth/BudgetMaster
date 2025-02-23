const express = require('express');
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  getTransactionsReport
} = require('../controllers/transactionController');

// Get all transactions
router.get('/', getTransactions);

// Get transactions report
router.get('/report', getTransactionsReport);

// Add new transaction
router.post('/', addTransaction);

module.exports = router; 