import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('/api/auth/register', { ...formData, role: 'candidate' });
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 dark:bg-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blend animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-300">Join our proctoring system</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 rounded-full mt-4 mx-auto"></div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
              placeholder="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
              placeholder="Email Address *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
              placeholder="Password *"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FaPhone className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
              placeholder="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FaVenusMars className="absolute left-3 top-3 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 text-center"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 hover:from-blue-600 hover:to-purple-600 dark:hover:from-purple-600 dark:hover:to-teal-600 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </motion.button>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <button
              className="text-blue-600 dark:text-purple-400 hover:underline font-medium"
              onClick={() => navigate('/')}
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;