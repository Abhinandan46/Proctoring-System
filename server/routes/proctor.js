const express = require('express');
const ProctorLog = require('../models/ProctorLog');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/log', auth, async (req, res) => {
  const log = new ProctorLog({ ...req.body, user: req.user.id });
  await log.save();
  res.json(log);
});

module.exports = router;