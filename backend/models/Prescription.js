const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  medicines: [{
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    dosage: String,
    frequency: String, // e.g., "3 times a day", "Once at night"
    duration: String, // e.g., "7 days"
    notes: String,
  }],
  diagnosis: { type: String },
  notes: { type: String },
  issuedDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true },
  medicineTiming: [{
    medicine: String,
    time: String, // HH:MM format
    taken: { type: Boolean, default: false },
    date: Date,
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
