import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

// Environment Variable को यहां डिफाइन करें
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Login/Register URL को फिक्स किया गया
    const url = isLogin 
      ? `${BACKEND_URL}/api/auth/login` 
      : `${BACKEND_URL}/api/auth/register`;
      
    try {
      const body = isLogin ? { email, password } : { email, password, name, role: 'candidate' };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          
          // 2. Fetch user info URL को फिक्स किया गया
          const userResponse = await fetch(`${BACKEND_URL}/api/auth/me`, { 
            headers: { Authorization: `Bearer ${data.token}` },
          });
          const userData = await userResponse.json();
          if (userData.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/candidate');
          }
        } else {
          // NOTE: DO NOT use alert() in production React apps. Use a modal or toast.
          alert('Registered successfully, please login'); 
          setIsLogin(true);
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Network error, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl w-full max-w-md shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <FaShieldAlt className="text-4xl text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Online Proctoring System</h1>
          <p className="text-gray-600 dark:text-gray-300">Secure and reliable exam monitoring</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-10"
                  required
                />
              </div>
            )}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                required
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-base font-medium"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline ml-1 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;