const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');
const candidateRoutes = require('./routes/candidates');
const resultRoutes = require('./routes/results');
const proctorRoutes = require('./routes/proctor');

app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/proctor', proctorRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));