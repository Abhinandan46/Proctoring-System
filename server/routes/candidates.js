const express = require('express');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.json(candidate);
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;