const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
  answers: Object,
  score: Number,
  submittedAt: Date,
});

module.exports = mongoose.model('Result', resultSchema);