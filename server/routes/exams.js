const express = require('express');
const Exam = require('../models/Exam');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all exams
router.get('/', auth, async (req, res) => {
  const exams = await Exam.find().populate('questions');
  res.json(exams);
});

// Get exam by id
router.get('/:id', auth, async (req, res) => {
  const exam = await Exam.findById(req.params.id).populate('questions');
  res.json(exam);
});

// Create exam (admin only)
router.post('/', auth, async (req, res) => {
  const exam = new Exam(req.body);
  await exam.save();
  res.status(201).json(exam);
});

module.exports = router;