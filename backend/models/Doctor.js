const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  doctorId: { type: String, required: true, unique: true },
  specialization: { type: String, enum: ['Ayurvedic', 'English'], required: true },
  qualifications: [String],
  experience: { type: Number }, // in years
  availability: { type: String, enum: ['Available', 'Away'], default: 'Away' },
  availableFrom: { type: String }, // Time in HH:MM format
  availableTill: { type: String },
  appointmentSlotDuration: { type: Number, default: 30 }, // in minutes
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Doctor', doctorSchema);
