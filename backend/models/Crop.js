const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cropName: { type: String, required: true, trim: true },
    fieldName: { type: String, trim: true, default: '' },
    areaInAcres: { type: Number, default: 0 },
    sowingDate: { type: Date },
    expectedHarvestDate: { type: Date },
    actualHarvestDate: { type: Date },
    yieldQuantity: { type: Number, default: 0 }, // in quintals/kg, user-defined unit
    yieldUnit: { type: String, default: 'kg' },
    status: {
      type: String,
      enum: ['planned', 'growing', 'harvested', 'failed'],
      default: 'planned',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
