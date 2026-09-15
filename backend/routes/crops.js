const express = require('express');
const Crop = require('../models/Crop');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/crops
router.get('/', async (req, res) => {
  const crops = await Crop.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(crops);
});

// POST /api/crops
router.post('/', async (req, res) => {
  try {
    const crop = await Crop.create({ ...req.body, user: req.userId });
    res.status(201).json(crop);
  } catch (err) {
    res.status(400).json({ message: 'Could not add crop.', error: err.message });
  }
});

// PUT /api/crops/:id
router.put('/:id', async (req, res) => {
  const crop = await Crop.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!crop) return res.status(404).json({ message: 'Crop not found.' });
  res.json(crop);
});

// DELETE /api/crops/:id
router.delete('/:id', async (req, res) => {
  const crop = await Crop.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!crop) return res.status(404).json({ message: 'Crop not found.' });
  res.json({ message: 'Crop deleted.' });
});

module.exports = router;
