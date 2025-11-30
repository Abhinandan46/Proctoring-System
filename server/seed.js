const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Test = require('./models/Test');
const Candidate = require('./models/Candidate');
const Result = require('./models/Result');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const seed = async () => {
  const hashedAdmin = await bcrypt.hash('admin123', 10);
  const hashedCandidate = await bcrypt.hash('candidate123', 10);

  const admin = await User.create({ email: 'admin@example.com', password: hashedAdmin, role: 'admin', name: 'Admin User' });
  const candidateUser = await User.create({ email: 'candidate@example.com', password: hashedCandidate, role: 'candidate', name: 'John Doe' });

  const test1 = await Test.create({
    title: 'Sample Test 1',
    description: 'A sample test for math',
    duration: 30,
    questions: [
      { question: 'What is 2+2?', options: ['3', '4', '5'], correct: '4' },
      { question: 'Capital of France?', options: ['London', 'Paris', 'Berlin'], correct: 'Paris' }
    ],
    published: true,
    createdBy: admin._id
  });

  const test2 = await Test.create({
    title: 'Sample Test 2',
    description: 'A sample test for science',
    duration: 45,
    questions: [
      { question: 'What is H2O?', options: ['Water', 'Oxygen', 'Hydrogen'], correct: 'Water' },
      { question: 'Planet closest to sun?', options: ['Venus', 'Mercury', 'Earth'], correct: 'Mercury' }
    ],
    published: true,
    createdBy: admin._id
  });

  const candidate = await Candidate.create({ name: 'John Doe', email: 'candidate@example.com', tests: [test1._id, test2._id] });

  // Add a sample result
  await Result.create({
    user: candidateUser._id,
    test: test1._id,
    answers: [
      { question: 'What is 2+2?', answer: '4', correct: true },
      { question: 'Capital of France?', answer: 'Paris', correct: true }
    ],
    score: 100,
    submittedAt: new Date()
  });

  console.log('Seeded with more data');
  process.exit();
};

seed();