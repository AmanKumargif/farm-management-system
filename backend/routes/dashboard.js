const express = require('express');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Crop = require('../models/Crop');
const Equipment = require('../models/Equipment');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);

  const [totalExpense] = await Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const [totalIncome] = await Income.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  // Monthly expense vs income trend (last 12 months)
  const monthlyExpense = await Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' } }, total: { $sum: '$amount' } } },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ]);
  const monthlyIncome = await Income.aggregate([
    { $match: { user: userId } },
    { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' } }, total: { $sum: '$amount' } } },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ]);

  // Expense breakdown by category
  const expenseByCategory = await Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);

  // Crop yield by crop name (harvested crops only)
  const cropYield = await Crop.aggregate([
    { $match: { user: userId, status: 'harvested' } },
    { $group: { _id: '$cropName', totalYield: { $sum: '$yieldQuantity' } } },
  ]);

  const cropCount = await Crop.countDocuments({ user: userId });
  const equipmentCount = await Equipment.countDocuments({ user: userId });
  const equipmentNeedingRepair = await Equipment.countDocuments({ user: userId, condition: 'needs_repair' });

  res.json({
    totalExpense: totalExpense?.total || 0,
    totalIncome: totalIncome?.total || 0,
    profitLoss: (totalIncome?.total || 0) - (totalExpense?.total || 0),
    cropCount,
    equipmentCount,
    equipmentNeedingRepair,
    monthlyExpense,
    monthlyIncome,
    expenseByCategory,
    cropYield,
  });
});

module.exports = router;
