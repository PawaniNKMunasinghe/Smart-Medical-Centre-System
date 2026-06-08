const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Doctor = require('../models/Doctor');
const Student = require('../models/Student');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

const router = express.Router();

// Get doctor profile
router.get('/profile', auth, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id })
      .populate('userId', '-password')
      .populate('appointments');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update availability
router.put('/availability', auth, authorize('doctor'), async (req, res) => {
  try {
    const { availability, availableFrom, availableTill } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      { availability, availableFrom, availableTill },
      { new: true }
    );

    res.json({ message: 'Availability updated', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all appointments for doctor
router.get('/appointments', auth, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('studentId', 'userId')
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept appointment
router.put('/appointments/:id/accept', auth, authorize('doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    ).populate('studentId').populate('doctorId');

    res.json({ message: 'Appointment accepted', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject appointment
router.put('/appointments/:id/reject', auth, authorize('doctor'), async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason },
      { new: true }
    ).populate('studentId').populate('doctorId');

    res.json({ message: 'Appointment rejected', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Complete appointment
router.put('/appointments/:id/complete', auth, authorize('doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );

    res.json({ message: 'Appointment completed', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search student by student ID
router.get('/search-student/:studentId', auth, authorize('doctor'), async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId })
      .populate('userId', 'name email phone')
      .populate('prescriptions');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student prescription history
router.get('/student/:studentId/prescriptions', auth, authorize('doctor'), async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const prescriptions = await Prescription.find({ studentId: student._id })
      .populate('medicines.medicineId')
      .sort({ issuedDate: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create prescription
router.post('/prescriptions', auth, authorize('doctor'), async (req, res) => {
  try {
    const { studentId, medicines, diagnosis, notes, expiryDate } = req.body;

    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const prescription = new Prescription({
      studentId,
      doctorId: doctor._id,
      medicines,
      diagnosis,
      notes,
      expiryDate: new Date(expiryDate),
    });

    await prescription.save();
    student.prescriptions.push(prescription._id);
    await student.save();

    res.status(201).json({ message: 'Prescription created successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
