import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { isAuthenticated, logout, getUser } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getUser();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
            data-testid="navbar-logo"
          >
            <span className="text-2xl font-heading font-bold text-gradient">
              AI Interview
            </span>
          </div>

          <div className="flex items-center gap-4">
            {authenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-zinc-300 hover:text-white transition-colors"
                  data-testid="navbar-dashboard-btn"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <User size={16} className="text-purple-400" />
                  <span className="text-sm text-white">
                    {user?.first_name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-zinc-300 hover:text-white"
                  data-testid="navbar-logout-btn"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all duration-300 text-sm"
                  data-testid="navbar-login-btn"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/auth?mode=signup')}
                  className="px-6 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300 text-sm"
                  data-testid="navbar-signup-btn"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
