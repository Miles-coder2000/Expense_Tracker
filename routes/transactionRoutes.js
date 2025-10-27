const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get transactions (with optional filters)
router.get('/', async (req, res) => {
  const { type, search } = req.query;
  const query = {};
  if (type) query.type = type;
  if (search) query.$or = [
    { category: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];

  const transactions = await Transaction.find(query).sort({ date: -1 });
  res.json(transactions);
});

// Add transaction
router.post('/', async (req, res) => {
  const newTransaction = new Transaction(req.body);
  const saved = await newTransaction.save();
  res.json(saved);
});

// Update transaction
router.put('/:id', async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: 'Transaction deleted' });
});

module.exports = router;
