const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: { type: String },
  dosage: { type: String }, // e.g., "500mg"
  form: { type: String }, // e.g., "Tablet", "Syrup", "Capsule"
  manufacturer: { type: String },
  description: { type: String },
  sideEffects: [String],
  precautions: [String],
  dosageInstructions: { type: String },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'pieces' }, // pieces, bottles, packs, etc.
  issuedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacist' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Medicine', medicineSchema);
