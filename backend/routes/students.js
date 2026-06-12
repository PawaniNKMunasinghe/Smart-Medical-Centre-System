const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Student = require('../models/Student');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Medicine = require('../models/Medicine');

const router = express.Router();

// Get student profile
router.get('/profile', auth, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id })
      .populate('userId', '-password')
      .populate('prescriptions')
      .populate('appointments');
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student prescriptions
router.get('/prescriptions', auth, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const prescriptions = await Prescription.find({ studentId: student._id })
      .populate('doctorId', 'name specialization')
      .populate('medicines.medicineId');

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get prescription by ID
router.get('/prescriptions/:id', auth, authorize('student'), async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('doctorId')
      .populate('medicines.medicineId');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Track medicine consumption
router.post('/prescriptions/:id/track-medicine', auth, authorize('student'), async (req, res) => {
  try {
    const { medicineTime, medicineName, date, taken } = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          medicineTiming: {
            medicine: medicineName,
            time: medicineTime,
            taken,
            date: new Date(date),
          }
        }
      },
      { new: true }
    );

    res.json({ message: 'Medicine tracking updated', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get appointments
router.get('/appointments', auth, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const appointments = await Appointment.find({ studentId: student._id })
      .populate('doctorId', 'name specialization')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book appointment
router.post('/appointments', auth, authorize('student'), async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, symptoms } = req.body;

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const appointment = new Appointment({
      studentId: student._id,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      symptoms,
    });

    await appointment.save();

    // Add to student's appointments
    student.appointments.push(appointment._id);
    await student.save();

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search doctors by name
router.get('/search-doctors', auth, authorize('student'), async (req, res) => {
  try {
    const { name, specialization } = req.query;
    let query = {};

    if (name) {
      query['userId'] = { $regex: name, $options: 'i' };
    }
    if (specialization) {
      query['specialization'] = specialization;
    }

    // Get doctors with availability
    const Doctor = require('../models/Doctor');
    const doctors = await Doctor.find(query)
      .populate('userId', 'name email phone');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get medicine side effects
router.get('/medicine/:id/side-effects', auth, authorize('student'), async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({
      name: medicine.name,
      sideEffects: medicine.sideEffects,
      precautions: medicine.precautions,
      dosageInstructions: medicine.dosageInstructions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
