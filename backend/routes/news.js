const express = require('express');
const auth = require('../middleware/auth');
const News = require('../models/News');
const HealthTips = require('../models/HealthTips');

const router = express.Router();

// Get all news by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = { isPublished: true };
    if (category) {
      query.category = category;
    }

    const news = await News.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get news by ID
router.get('/news/:id', async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('createdBy', 'name');

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get health tips
router.get('/health-tips', async (req, res) => {
  try {
    const { category } = req.query;

    let query = { isPublished: true };
    if (category) {
      query.category = category;
    }

    const healthTips = await HealthTips.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(healthTips);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get health tip by ID
router.get('/health-tips/:id', async (req, res) => {
  try {
    const healthTip = await HealthTips.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!healthTip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    res.json(healthTip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
