const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, trim: true, default: '' }, // tractor, tiller, pump, etc.
    purchaseDate: { type: Date },
    purchaseCost: { type: Number, default: 0 },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'needs_repair', 'retired'],
      default: 'good',
    },
    lastServiceDate: { type: Date },
    nextServiceDue: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
