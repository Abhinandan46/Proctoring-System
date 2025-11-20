import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaClipboardList,
  FaHistory,
  FaPlay,
  FaEye,
  FaSignOutAlt,
  FaShieldAlt,
  FaEnvelope,
  FaUserTag,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaVenusMars
} from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

const CandidateDashboard = () => {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDateOfBirth, setEditDateOfBirth] = useState('');
  const [editGender, setEditGender] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [testsRes, resultsRes, userRes] = await Promise.all([
          axios.get('/api/tests', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/results', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setTests(testsRes.data.filter(t => t.published));
        setResults(resultsRes.data);
        setUser(userRes.data);
        setEditName(userRes.data.name || '');
        setEditPhone(userRes.data.phone || '');
        setEditAddress(userRes.data.address || '');
        setEditDateOfBirth(userRes.data.dateOfBirth ? userRes.data.dateOfBirth.split('T')[0] : '');
        setEditGender(userRes.data.gender || '');
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/auth/me', {
        name: editName,
        phone: editPhone,
        address: editAddress,
        dateOfBirth: editDateOfBirth,
        gender: editGender
      }, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="text-center z-10">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 dark:bg-red-900/20 backdrop-blur-lg border border-red-200 dark:border-red-800 rounded-3xl p-8 shadow-2xl max-w-md"
      >
        <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
      </motion.div>
    </div>
  );

  return (
    <>
      {/* Sticky Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="text-2xl text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Proctoring System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 hover:shadow-lg"
            >
              <FaSignOutAlt className="inline mr-2" />
              Logout
            </button>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ready to ace your next test? Let's get started.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 rounded-full mt-4"></div>
        </motion.div>

        {/* Profile Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl mb-8 hover:shadow-3xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
              <FaUser className="mr-3 text-blue-500" />
              Profile Information
            </h2>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          {editing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={editDateOfBirth}
                    onChange={(e) => setEditDateOfBirth(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-white/20 dark:border-gray-600/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-white/10 dark:bg-gray-700/10 rounded-2xl">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <FaUser className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{user?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/10 dark:bg-gray-700/10 rounded-2xl">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                  <FaEnvelope className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/10 dark:bg-gray-700/10 rounded-2xl">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <FaUserTag className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                  <p className="font-semibold text-gray-800 dark:text-white capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/10 dark:bg-gray-700/10 rounded-2xl">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
                  <FaPhone className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{user?.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/10 dark:bg-gray-700/10 rounded-2xl">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                  <FaMapMarkerAlt className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{user?.address || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/10 dark:bg-gray-700/10 rounded-2xl">
                <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
                  <FaCalendarAlt className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/10 dark:bg-gray-700/10 rounded-2xl">
                <div className="p-3 bg-pink-100 dark:bg-pink-900/50 rounded-full">
                  <FaVenusMars className="text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                  <p className="font-semibold text-gray-800 dark:text-white capitalize">{user?.gender || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Available Tests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
            <FaClipboardList className="mr-3 text-blue-500" />
            Available Tests
          </h2>
          {tests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-8 text-center shadow-xl"
            >
              <p className="text-gray-600 dark:text-gray-300 text-lg">No tests available at the moment.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests && Array.isArray(tests) && tests.map((test, index) => (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 rounded-full mb-4"></div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{test.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{test.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <span className="font-medium">{test.duration} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Questions:</span>
                      <span className="font-medium">{test.questions?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Created by:</span>
                      <span className="font-medium">{test.createdBy?.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                      Active
                    </span>
                    <Link
                      to={`/test/${test._id}`}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 hover:from-blue-600 hover:to-purple-600 dark:hover:from-purple-600 dark:hover:to-teal-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                    >
                      <FaPlay className="inline mr-2" />
                      Start Test
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Test History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <FaHistory className="mr-3 text-purple-500" />
            Test History
          </h2>
          {results.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center py-8">No test history available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 font-semibold text-gray-800 dark:text-white">Test Title</th>
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      className={`border-b border-gray-100 dark:border-gray-700 hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/5 dark:bg-gray-800/5' : ''}`}
                    >
                      <td className="p-4 font-medium text-gray-800 dark:text-white">{result.test?.title || 'N/A'}</td>
                      <td className="p-4">
                        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                          {result.score}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{new Date(result.submittedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        {result.score > (result.test?.questions?.length || 0) / 2 ? (
                          <span className="flex items-center text-green-600 dark:text-green-400">
                            <FaCheckCircle className="mr-2" />
                            Passed
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600 dark:text-red-400">
                            <FaTimesCircle className="mr-2" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <Link
                          to={`/result-summary/${result._id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          <FaEye className="inline mr-1" />
                          View Details
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default CandidateDashboard;