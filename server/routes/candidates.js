const express = require('express');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const candidate = new Candidate(req.body);
  await candidate.save();
  res.json(candidate);
});

router.get('/', auth, async (req, res) => {
  const candidates = await Candidate.find();
  res.json(candidates);
});

module.exports = router;