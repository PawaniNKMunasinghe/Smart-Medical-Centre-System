const express = require('express');
const auth = require('../middleware/auth');
const Medicine = require('../models/Medicine');

const router = express.Router();

// Get all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search medicines by name
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: name, $options: 'i' } },
        { genericName: { $regex: name, $options: 'i' } }
      ]
    });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get medicine by ID
router.get('/:id', async (req, res) => {
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
