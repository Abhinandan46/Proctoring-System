const express = require('express');
const mongoose = require('mongoose');
const Test = require('../models/Test');
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

router.post('/generate', auth, async (req, res) => {
  try {
    const { topic, numQuestions, difficulty } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate a multiple-choice quiz on the topic "${topic}" with ${numQuestions} questions. Each question should have 4 options (A, B, C, D) and one correct answer. Difficulty level: ${difficulty}. Format the response as JSON with the following structure:
    {
      "questions": [
        {
          "question": "Question text",
          "type": "mcq",
          "options": ["A) Option1", "B) Option2", "C) Option3", "D) Option4"],
          "correctAnswer": "A"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const generatedTest = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));

    res.json(generatedTest);
  } catch (error) {
    console.error('Error generating test:', error);
    res.status(500).json({ message: 'Error generating test' });
  }
});

module.exports = router;