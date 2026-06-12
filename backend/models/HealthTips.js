const mongoose = require('mongoose');

const healthTipsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['General', 'Fitness', 'Nutrition', 'Mental Health', 'Sleep', 'Children'],
    required: true
  },
  image: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HealthTips', healthTipsSchema);
