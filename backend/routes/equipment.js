const express = require('express');
const Equipment = require('../models/Equipment');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/equipment
router.get('/', async (req, res) => {
  const equipment = await Equipment.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(equipment);
});

// POST /api/equipment
router.post('/', async (req, res) => {
  try {
    const item = await Equipment.create({ ...req.body, user: req.userId });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Could not add equipment.', error: err.message });
  }
});

// PUT /api/equipment/:id
router.put('/:id', async (req, res) => {
  const item = await Equipment.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: 'Equipment not found.' });
  res.json(item);
});

// DELETE /api/equipment/:id
router.delete('/:id', async (req, res) => {
  const item = await Equipment.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!item) return res.status(404).json({ message: 'Equipment not found.' });
  res.json({ message: 'Equipment deleted.' });
});

module.exports = router;
