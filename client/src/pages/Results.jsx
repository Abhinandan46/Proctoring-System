import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FaChartBar, FaTrophy, FaUser, FaCalendar, FaEye, FaTrash } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

const Results = () => {
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/results', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(Array.isArray(res.data) ? res.data : []);
    };
    fetchResults();
  }, []);

  const deleteResult = async (id) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`/api/results/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setResults(results.filter(r => r._id !== id));
  };

  const data = results && Array.isArray(results) ? results.map(r => ({ name: r.user?.email || 'N/A', score: r.score })) : [];

  return (
    <div className="bg-background min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-purple-900 dark:via-indigo-900 dark:to-teal-900 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 dark:bg-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blend animation-delay-4000"></div>

        <div className="relative z-10 p-6 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
              Test Results
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              View and analyze exam performance data
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 rounded-full mt-4 mx-auto"></div>
          </motion.div>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FaChartBar className="mr-3 text-purple-500" />
              Performance Overview
            </h2>
            <div className="w-full overflow-x-auto">
              <BarChart width={600} height={300} data={data} className="mx-auto">
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </motion.div>

          {/* Results Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FaTrophy className="mr-3 text-yellow-500" />
              Detailed Results ({results.length})
            </h2>

            {results.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FaChartBar className="text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 text-lg">No results available yet.</p>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Candidate</th>
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Score</th>
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Date</th>
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results && Array.isArray(results) && results.map((result, index) => (
                      <motion.tr
                        key={result._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors duration-200"
                      >
                        <td className="p-4 font-medium text-gray-800 dark:text-white flex items-center">
                          <FaUser className="mr-3 text-blue-500" />
                          {result.user?.email || 'N/A'}
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                            {result.score}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300 flex items-center">
                          <FaCalendar className="mr-3 text-green-500" />
                          {new Date(result.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {result.score > (result.test?.questions?.length || 0) / 2 ? (
                            <span className="flex items-center text-green-600 dark:text-green-400">
                              <FaTrophy className="mr-2" />
                              Passed
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600 dark:text-red-400">
                              <FaTrophy className="mr-2" />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
                              onClick={() => {
                                // Navigate to detailed result view
                              }}
                            >
                              <FaEye className="inline mr-1" />
                              View Details
                            </motion.button>
                            {user?.role === 'admin' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="px-3 py-1 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                                onClick={() => deleteResult(result._id)}
                              >
                                <FaTrash className="inline mr-1" />
                                Delete
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Results;