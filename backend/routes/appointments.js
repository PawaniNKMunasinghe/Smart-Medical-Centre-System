const express = require('express');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Get available doctors
router.get('/available-doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({ availability: 'Available' })
      .populate('userId', 'name email phone');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get doctors by specialization
router.get('/doctors/:specialization', async (req, res) => {
  try {
    const doctors = await Doctor.find({ 
      specialization: req.params.specialization 
    }).populate('userId', 'name email phone');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get doctor availability
router.get('/doctor/:doctorId/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      availability: doctor.availability,
      availableFrom: doctor.availableFrom,
      availableTill: doctor.availableTill,
      appointmentSlotDuration: doctor.appointmentSlotDuration,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get appointments by date range
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('studentId')
      .populate('doctorId');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
