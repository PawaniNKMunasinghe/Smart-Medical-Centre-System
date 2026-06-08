const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  studentId: { type: String, required: true, unique: true },
  department: { type: String },
  semester: { type: Number },
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  medicalHistory: [{ 
    date: Date,
    description: String,
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);
