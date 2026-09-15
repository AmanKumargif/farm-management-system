const express = require('express');
const Income = require('../models/Income');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
router.use(auth);

// GET /api/income
router.get('/', async (req, res) => {
  const income = await Income.find({ user: req.userId }).sort({ date: -1 });
  res.json(income);
});

// POST /api/income (multipart/form-data, field name "invoice")
router.post('/', upload.single('invoice'), async (req, res) => {
  try {
    const invoiceUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const income = await Income.create({ ...req.body, invoiceUrl, user: req.userId });
    res.status(201).json(income);
  } catch (err) {
    res.status(400).json({ message: 'Could not add income.', error: err.message });
  }
});

// PUT /api/income/:id
router.put('/:id', upload.single('invoice'), async (req, res) => {
  const update = { ...req.body };
  if (req.file) update.invoiceUrl = `/uploads/${req.file.filename}`;
  const income = await Income.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    update,
    { new: true, runValidators: true }
  );
  if (!income) return res.status(404).json({ message: 'Income record not found.' });
  res.json(income);
});

// DELETE /api/income/:id
router.delete('/:id', async (req, res) => {
  const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!income) return res.status(404).json({ message: 'Income record not found.' });
  res.json({ message: 'Income record deleted.' });
});

module.exports = router;
