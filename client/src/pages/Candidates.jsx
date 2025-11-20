import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUsers, FaUserPlus, FaEnvelope, FaUserTag, FaTrash, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auth/candidates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(res.data);
    };
    fetchCandidates();
  }, []);

  const addCandidate = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/candidates', { name, email }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setName('');
    setEmail('');
    // Refresh
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-purple-900 dark:via-indigo-900 dark:to-teal-900 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 dark:bg-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 p-6 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
              Manage Candidates
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Add and manage exam participants
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 rounded-full mt-4 mx-auto"></div>
          </motion.div>

          {/* Add Candidate Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FaUserPlus className="mr-3 text-green-500" />
              Add New Candidate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter candidate name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter candidate email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-600 dark:to-blue-600 hover:from-green-600 hover:to-blue-600 dark:hover:from-green-700 dark:hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform"
              onClick={addCandidate}
            >
              <FaUserPlus className="inline mr-2" />
              Add Candidate
            </motion.button>
          </motion.div>

          {/* Candidates List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FaUsers className="mr-3 text-blue-500" />
              Candidates ({candidates.length})
            </h2>

            {candidates.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FaUsers className="text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 text-lg">No candidates added yet.</p>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Name</th>
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Email</th>
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Phone</th>
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Address</th>
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Date of Birth</th>
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Gender</th>
                      <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates && Array.isArray(candidates) && candidates.map((candidate, index) => (
                      <motion.tr
                        key={candidate._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors duration-200"
                      >
                        <td className="p-4 font-medium text-gray-800 dark:text-white flex items-center">
                          <FaUserTag className="mr-3 text-blue-500" />
                          {candidate.name}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300 flex items-center">
                          <FaEnvelope className="mr-3 text-green-500" />
                          {candidate.email}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300 flex items-center">
                          <FaPhone className="mr-3 text-yellow-500" />
                          {candidate.phone || 'N/A'}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300 flex items-center">
                          <FaMapMarkerAlt className="mr-3 text-orange-500" />
                          {candidate.address || 'N/A'}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300 flex items-center">
                          <FaCalendarAlt className="mr-3 text-red-500" />
                          {candidate.dateOfBirth ? new Date(candidate.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300 flex items-center">
                          <FaVenusMars className="mr-3 text-pink-500" />
                          {candidate.gender || 'N/A'}
                        </td>
                        <td className="p-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-3 py-1 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to remove this candidate?')) {
                                // Add remove functionality
                              }
                            }}
                          >
                            <FaTrash className="inline mr-1" />
                            Remove
                          </motion.button>
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

export default Candidates;