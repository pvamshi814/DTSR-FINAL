import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Calendar, MapPin, Building, Briefcase, Linkedin, Upload } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import api from '../utils/api';
import { setToken, setUser } from '../utils/auth';
import { toast } from 'sonner';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
    gender: '',
    city: '',
    state: '',
    country: '',
    highest_qualification: '',
    university: '',
    graduation_year: '',
    current_status: '',
    skills: '',
    linkedin: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', loginData);
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success('Login successful!');
      const redirect = searchParams.get('redirect') || 'select-degree';
      navigate(`/${redirect}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { confirm_password, ...submitData } = signupData;
      const res = await api.post('/auth/signup', submitData);
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success('Account created successfully!');
      navigate('/select-degree');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-zinc-400">
              {mode === 'login'
                ? 'Login to continue your interview practice'
                : 'Join thousands preparing for success'}
            </p>
          </motion.div>

          <GlassCard className="p-8" hover={false}>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
                data-testid="login-tab"
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
                data-testid="signup-tab"
              >
                Sign Up
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white"
                    placeholder="your@email.com"
                    data-testid="login-email-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    <Lock size={16} className="inline mr-2" />
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white"
                    placeholder="••••••••"
                    data-testid="login-password-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300 disabled:opacity-50"
                  data-testid="login-submit-btn"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signupData.first_name}
                      onChange={(e) => setSignupData({ ...signupData, first_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white"
                      data-testid="signup-firstname-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signupData.last_name}
                      onChange={(e) => setSignupData({ ...signupData, last_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white"
                      data-testid="signup-lastname-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white"
                    data-testid="signup-email-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={signupData.mobile}
                    onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white"
                    data-testid="signup-mobile-input"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white"
                      data-testid="signup-password-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={signupData.confirm_password}
                      onChange={(e) => setSignupData({ ...signupData, confirm_password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white"
                      data-testid="signup-confirm-password-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Highest Qualification
                    </label>
                    <input
                      type="text"
                      value={signupData.highest_qualification}
                      onChange={(e) => setSignupData({ ...signupData, highest_qualification: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Current Status
                    </label>
                    <select
                      value={signupData.current_status}
                      onChange={(e) => setSignupData({ ...signupData, current_status: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white"
                    >
                      <option value="">Select Status</option>
                      <option value="Student">Student</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Job Seeker">Job Seeker</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300 disabled:opacity-50"
                  data-testid="signup-submit-btn"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
