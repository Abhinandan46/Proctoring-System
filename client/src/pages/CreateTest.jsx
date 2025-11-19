import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaSave, FaQuestionCircle, FaListOl, FaFileAlt, FaClock } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

const CreateTest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', type: 'mcq', options: ['', ''], correctAnswer: '' }]);
  };

  const addOption = (qIndex) => {
    const newQ = [...questions];
    newQ[qIndex].options.push('');
    setQuestions(newQ);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const newQ = [...questions];
    newQ[qIndex].options[optIndex] = value;
    setQuestions(newQ);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/tests', { title, description, duration, questions }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Test created');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-purple-900 dark:via-indigo-900 dark:to-teal-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 dark:bg-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blend animation-delay-4000"></div>

      {/* Fixed Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            Create New Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Design comprehensive exams with multiple question types
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 rounded-full mt-4 mx-auto"></div>
        </motion.div>

        {/* Test Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <FaFileAlt className="mr-3 text-blue-500" />
            Test Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Test Title</label>
                <input
                  className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter test title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaClock className="mr-2" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="60"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 h-32 resize-none"
                placeholder="Describe the test purpose and instructions"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Questions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
              <FaQuestionCircle className="mr-3 text-purple-500" />
              Questions ({questions.length})
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 hover:from-blue-600 hover:to-purple-600 dark:hover:from-purple-600 dark:hover:to-teal-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform flex items-center"
              onClick={addQuestion}
            >
              <FaPlus className="mr-2" />
              Add Question
            </motion.button>
          </div>

          <div className="space-y-6">
            {questions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Question {i + 1}</h3>
                  <button
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question Text</label>
                    <input
                      className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Enter your question"
                      value={q.question}
                      onChange={e => {
                        const newQ = [...questions];
                        newQ[i].question = e.target.value;
                        setQuestions(newQ);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question Type</label>
                    <select
                      className="px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white"
                      value={q.type}
                      onChange={e => {
                        const newQ = [...questions];
                        newQ[i].type = e.target.value;
                        setQuestions(newQ);
                      }}
                    >
                      <option value="mcq">Multiple Choice</option>
                      <option value="multi">Multi-select</option>
                      <option value="short">Short Answer</option>
                    </select>
                  </div>

                  {q.type !== 'short' && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                        <button
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center text-sm"
                          onClick={() => addOption(i)}
                        >
                          <FaPlus className="mr-1" />
                          Add Option
                        </button>
                      </div>
                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-3">
                            <input
                              className="flex-1 px-4 py-2 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder={`Option ${optIndex + 1}`}
                              value={opt}
                              onChange={(e) => updateOption(i, optIndex, e.target.value)}
                            />
                            <button
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              onClick={() => {
                                const newQ = [...questions];
                                newQ[i].options.splice(optIndex, 1);
                                setQuestions(newQ);
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correct Answer</label>
                        <input
                          className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="Enter the correct answer"
                          value={q.correctAnswer}
                          onChange={e => {
                            const newQ = [...questions];
                            newQ[i].correctAnswer = e.target.value;
                            setQuestions(newQ);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-600 dark:to-blue-600 hover:from-green-600 hover:to-blue-600 dark:hover:from-green-700 dark:hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl transform flex items-center mx-auto"
            onClick={handleSubmit}
          >
            <FaSave className="mr-3" />
            Create Test
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTest;