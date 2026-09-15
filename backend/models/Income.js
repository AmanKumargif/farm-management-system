const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    source: {
      type: String,
      enum: ['crop_sale', 'equipment_rental', 'government_subsidy', 'other'],
      required: true,
    },
    description: { type: String, trim: true, default: '' },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    relatedCrop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', default: null },
    invoiceUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);
