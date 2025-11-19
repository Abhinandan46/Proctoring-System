const express = require('express');
const mongoose = require('mongoose');
const Result = require('../models/Result');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const results = await Result.find().populate('user', 'email').populate('test', 'title');
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/submit', auth, async (req, res) => {
  try {
    const { testId, ...rest } = req.body;
    const result = new Result({ test: testId, ...rest, user: req.user.id });
    await result.save();
    res.json(result);
  } catch (error) {
    console.error('Error submitting result:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const result = await Result.findById(req.params.id).populate('test', 'title').populate('user', 'email');
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/test/:testId', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.testId)) {
    return res.status(400).json({ message: 'Invalid test ID' });
  }
  try {
    const results = await Result.find({ test: req.params.testId });
    res.json(results);
  } catch (error) {
    console.error('Error fetching results by test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:userId', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try {
    const results = await Result.find({ user: req.params.userId });
    res.json(results);
  } catch (error) {
    console.error('Error fetching results by user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;