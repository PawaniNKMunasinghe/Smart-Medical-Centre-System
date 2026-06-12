const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Prescription = require('../models/Prescription');

const router = express.Router();

// Get all prescriptions (admin/pharmacist)
router.get('/', auth, authorize('admin', 'pharmacist'), async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('studentId')
      .populate('doctorId')
      .populate('medicines.medicineId');

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get prescription by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('studentId')
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

// Update prescription
router.put('/:id', auth, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const { medicines, diagnosis, notes, expiryDate, isActive } = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { medicines, diagnosis, notes, expiryDate, isActive },
      { new: true }
    ).populate('studentId').populate('doctorId').populate('medicines.medicineId');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ message: 'Prescription updated successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete prescription
router.delete('/:id', auth, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
