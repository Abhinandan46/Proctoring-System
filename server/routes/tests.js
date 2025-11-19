const express = require('express');
const mongoose = require('mongoose');
const Test = require('../models/Test');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const test = new Test({ ...req.body, createdBy: req.user.id });
    await test.save();
    res.json(test);
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const tests = await Test.find().populate('createdBy', 'email role');
    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const test = await Test.findById(req.params.id);
    res.json(test);
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(test);
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test deleted' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/publish', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, { published: req.body.published }, { new: true });
    res.json(test);
  } catch (error) {
    console.error('Error publishing test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;