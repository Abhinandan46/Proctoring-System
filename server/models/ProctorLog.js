const mongoose = require('mongoose');

const proctorLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
  eventType: String,
  timestamp: Date,
});

module.exports = mongoose.model('ProctorLog', proctorLogSchema);