import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaList, FaEye, FaEyeSlash, FaTrash, FaPlus, FaCog } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

const ManageTests = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/tests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTests(res.data);
    };
    fetchTests();
  }, []);

  const togglePublish = async (id, currentPublished) => {
    const token = localStorage.getItem('token');
    await axios.patch(`/api/tests/${id}/publish`, { published: !currentPublished }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Refresh
    const res = await axios.get('/api/tests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTests(res.data);
  };

  const deleteTest = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/tests/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Refresh
    const res = await axios.get('/api/tests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTests(res.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-purple-900 dark:via-indigo-900 dark:to-teal-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 dark:bg-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Fixed Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            Manage Tests
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Control test visibility and manage your exam library
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 rounded-full mt-4 mx-auto"></div>
        </motion.div>

        {/* Tests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
              <FaList className="mr-3 text-blue-500" />
              Test Library ({tests.length})
            </h2>
          </div>

          {tests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FaCog className="text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">No tests found. Create your first test!</p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Title</th>
                    <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Questions</th>
                    <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Duration</th>
                    <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tests && Array.isArray(tests) && tests.map((test, index) => (
                    <motion.tr
                      key={test._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors duration-200"
                    >
                      <td className="p-4 font-medium text-gray-800 dark:text-white">{test.title}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{test.questions?.length || 0}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{test.duration} min</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          test.published
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                        }`}>
                          {test.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                              test.published
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                            onClick={() => togglePublish(test._id, test.published)}
                          >
                            {test.published ? <FaEyeSlash className="inline mr-1" /> : <FaEye className="inline mr-1" />}
                            {test.published ? 'Unpublish' : 'Publish'}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-3 py-1 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this test?')) {
                                deleteTest(test._id);
                              }
                            }}
                          >
                            <FaTrash className="inline mr-1" />
                            Delete
                          </motion.button>
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
  );
};

export default ManageTests;