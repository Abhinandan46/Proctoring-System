const express = require('express');
const Test = require('../models/Test');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const test = new Test({ ...req.body, createdBy: req.user.id });
  await test.save();
  res.json(test);
});

router.get('/', auth, async (req, res) => {
  const tests = await Test.find().populate('createdBy', 'email role');
  res.json(tests);
});

router.get('/:id', auth, async (req, res) => {
  const test = await Test.findById(req.params.id);
  res.json(test);
});

router.put('/:id', auth, async (req, res) => {
  const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(test);
});

router.delete('/:id', auth, async (req, res) => {
  await Test.findByIdAndDelete(req.params.id);
  res.json({ message: 'Test deleted' });
});

router.patch('/:id/publish', auth, async (req, res) => {
  const test = await Test.findByIdAndUpdate(req.params.id, { published: true }, { new: true });
  res.json(test);
});

module.exports = router;