const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  type: { type: String, enum: ['mcq', 'multi', 'short'] },
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
});

const testSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: Number,
  questions: [questionSchema],
  published: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Test', testSchema);