const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const User = require('../models/User');
const Student = require('../models/Student');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const News = require('../models/News');
const HealthTips = require('../models/HealthTips');
const Prescription = require('../models/Prescription');
const { startOfMonth, endOfMonth, format } = require('date-fns');

const router = express.Router();

// Get all users
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete role-specific records
    if (user.role === 'student') {
      await Student.deleteOne({ userId: user._id });
    } else if (user.role === 'doctor') {
      await Doctor.deleteOne({ userId: user._id });
    } else if (user.role === 'pharmacist') {
      await Pharmacist.deleteOne({ userId: user._id });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID
router.get('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add news
router.post('/news', auth, authorize('admin'), async (req, res) => {
  try {
    const { title, description, category, image } = req.body;

    const news = new News({
      title,
      description,
      category,
      image,
      createdBy: req.user.id,
    });

    await news.save();
    res.status(201).json({ message: 'News added successfully', news });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all news
router.get('/news', auth, authorize('admin'), async (req, res) => {
  try {
    const news = await News.find().populate('createdBy', 'name');
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update news
router.put('/news/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { title, description, category, image, isPublished } = req.body;

    const news = await News.findByIdAndUpdate(
      req.params.id,
      { title, description, category, image, isPublished },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News updated successfully', news });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete news
router.delete('/news/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add health tips
router.post('/health-tips', auth, authorize('admin'), async (req, res) => {
  try {
    const { title, description, category, image } = req.body;

    const healthTips = new HealthTips({
      title,
      description,
      category,
      image,
      createdBy: req.user.id,
    });

    await healthTips.save();
    res.status(201).json({ message: 'Health tip added successfully', healthTips });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get monthly report
router.get('/reports/monthly', auth, authorize('admin'), async (req, res) => {
  try {
    const { month, year } = req.query;
    const targetMonth = parseInt(month) || new Date().getMonth() + 1;
    const targetYear = parseInt(year) || new Date().getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // Get prescriptions issued in the month
    const prescriptions = await Prescription.find({
      issuedDate: { $gte: startDate, $lte: endDate }
    }).populate('studentId');

    // Count unique students who got sick
    const studentsCount = new Set(
      prescriptions.map(p => p.studentId._id.toString())
    ).size;

    res.json({
      month: format(startDate, 'MMMM yyyy'),
      totalPrescriptions: prescriptions.length,
      uniqueStudentsAffected: studentsCount,
      prescriptions: prescriptions.map(p => ({
        studentId: p.studentId.studentId,
        studentName: p.studentId.userId.name,
        diagnosis: p.diagnosis,
        date: p.issuedDate,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalPharmacists = await Pharmacist.countDocuments();
    const totalPrescriptions = await Prescription.countDocuments();

    res.json({
      totalUsers,
      totalStudents,
      totalDoctors,
      totalPharmacists,
      totalPrescriptions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
