const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
});

module.exports = mongoose.model('Candidate', candidateSchema);