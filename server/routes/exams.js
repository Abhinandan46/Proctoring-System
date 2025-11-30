const express = require('express');
const Test = require('../models/Test');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all exams
router.get('/', async (req, res) => {
  const exams = await Test.find().populate('questions');
  res.json(exams);
});

// Get exam by id
router.get('/:id', async (req, res) => {
  const exam = await Test.findById(req.params.id).populate('questions');
  res.json(exam);
});

// Create exam (admin only)
router.post('/', auth, async (req, res) => {
  const exam = new Test(req.body);
  await exam.save();
  res.status(201).json(exam);
});

module.exports = router;