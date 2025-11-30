const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, just log
});

const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exams');
const testRoutes = require('./routes/tests');
const candidateRoutes = require('./routes/candidates');
const resultRoutes = require('./routes/results');
const proctorRoutes = require('./routes/proctor');

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/proctor', proctorRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));