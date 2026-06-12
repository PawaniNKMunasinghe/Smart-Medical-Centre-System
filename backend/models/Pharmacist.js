const mongoose = require('mongoose');

const pharmacistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  pharmacistId: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true },
  pharmacy: { type: String },
  issuedMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pharmacist', pharmacistSchema);
