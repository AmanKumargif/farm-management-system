const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: {
      type: String,
      enum: ['seeds', 'fertilizer', 'pesticide', 'labor', 'irrigation', 'equipment', 'fuel', 'other'],
      required: true,
    },
    description: { type: String, trim: true, default: '' },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    relatedCrop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', default: null },
    receiptUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
