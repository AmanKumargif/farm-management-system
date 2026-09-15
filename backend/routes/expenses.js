const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
router.use(auth);

// GET /api/expenses
router.get('/', async (req, res) => {
  const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
  res.json(expenses);
});

// POST /api/expenses  (multipart/form-data, field name "receipt")
router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    const receiptUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const expense = await Expense.create({ ...req.body, receiptUrl, user: req.userId });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: 'Could not add expense.', error: err.message });
  }
});

// PUT /api/expenses/:id
router.put('/:id', upload.single('receipt'), async (req, res) => {
  const update = { ...req.body };
  if (req.file) update.receiptUrl = `/uploads/${req.file.filename}`;
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    update,
    { new: true, runValidators: true }
  );
  if (!expense) return res.status(404).json({ message: 'Expense not found.' });
  res.json(expense);
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!expense) return res.status(404).json({ message: 'Expense not found.' });
  res.json({ message: 'Expense deleted.' });
});

module.exports = router;
