const express = require('express');
const Result = require('../models/Result');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const results = await Result.find().populate('user', 'email').populate('test', 'title');
  res.json(results);
});

router.post('/submit', auth, async (req, res) => {
  const result = new Result({ ...req.body, user: req.user.id });
  await result.save();
  res.json(result);
});

router.get('/:testId', auth, async (req, res) => {
  const results = await Result.find({ test: req.params.testId });
  res.json(results);
});

router.get('/user/:userId', auth, async (req, res) => {
  const results = await Result.find({ user: req.params.userId });
  res.json(results);
});

module.exports = router;