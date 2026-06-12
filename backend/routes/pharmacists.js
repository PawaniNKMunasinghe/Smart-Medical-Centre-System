const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Pharmacist = require('../models/Pharmacist');
const Medicine = require('../models/Medicine');
const Prescription = require('../models/Prescription');

const router = express.Router();

// Get pharmacist profile
router.get('/profile', auth, authorize('pharmacist'), async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findOne({ userId: req.user.id })
      .populate('userId', '-password');

    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist profile not found' });
    }

    res.json(pharmacist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all medicines
router.get('/medicines', auth, authorize('pharmacist'), async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new medicine
router.post('/medicines', auth, authorize('pharmacist'), async (req, res) => {
  try {
    const {
      name,
      genericName,
      dosage,
      form,
      manufacturer,
      description,
      sideEffects,
      precautions,
      dosageInstructions,
      stock,
      unit,
    } = req.body;

    const pharmacist = await Pharmacist.findOne({ userId: req.user.id });
    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    const medicine = new Medicine({
      name,
      genericName,
      dosage,
      form,
      manufacturer,
      description,
      sideEffects: Array.isArray(sideEffects) ? sideEffects : [],
      precautions: Array.isArray(precautions) ? precautions : [],
      dosageInstructions,
      stock,
      unit,
    });

    await medicine.save();
    pharmacist.issuedMedicines.push(medicine._id);
    await pharmacist.save();

    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update medicine stock
router.put('/medicines/:id', auth, authorize('pharmacist'), async (req, res) => {
  try {
    const { stock, name, genericName, dosage, form, manufacturer, description, sideEffects, precautions, dosageInstructions, unit } = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      {
        stock,
        ...(name && { name }),
        ...(genericName && { genericName }),
        ...(dosage && { dosage }),
        ...(form && { form }),
        ...(manufacturer && { manufacturer }),
        ...(description && { description }),
        ...(sideEffects && { sideEffects }),
        ...(precautions && { precautions }),
        ...(dosageInstructions && { dosageInstructions }),
        ...(unit && { unit }),
      },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({ message: 'Medicine updated successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Issue medicine for prescription
router.post('/issue-medicine/:medicineId', auth, authorize('pharmacist'), async (req, res) => {
  try {
    const { prescriptionId, quantity } = req.body;

    const medicine = await Medicine.findById(req.params.medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (medicine.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    medicine.stock -= quantity;
    await medicine.save();

    const prescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      { $set: { isActive: false } },
      { new: true }
    );

    res.json({ 
      message: 'Medicine issued successfully',
      medicine,
      prescription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get medicine by ID
router.get('/medicines/:id', auth, authorize('pharmacist'), async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
