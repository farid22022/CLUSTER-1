import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import clusterLogo from '../../../public/logo/cluster.png';
import profileImage from '../../../public/logo/profile.jpg';

import { useAuth } from '../../providers/AuthProvider';  
import {
   LogOut, User, LayoutDashboard, ChevronDown, Menu, X,Activity
} from 'lucide-react';

const NavBar = () => {
  const { user, loading: authLoading, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isLoggedIn = !!user && !authLoading;
  const isPresident = user?.current_membership?.role?.is_president;
  const currentRoleName = user?.current_membership?.role?.name || 'User';

  // Determine if user should see dashboard link
  const canAccessDashboard = isPresident || 
    (currentRoleName.toLowerCase().includes('admin') || 
     currentRoleName.toLowerCase().includes('president'));

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed', err);
      // Force logout anyway
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gradient-to-r from-blue-900/95 to-indigo-900/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-black/80 py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={clusterLogo}
              alt="CLUSTER Logo"
              className="h-10 md:h-12 object-contain"
            />
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
              CLUSTER
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              {[
                { to: '/', label: 'Home' },
                { to: '/posts', label: 'Posts' },
                { to: '/events', label: 'Events' },
                { to: '/projects', label: 'Projects' },
                { to: '/resources', label: 'Resources' },
                { to: '/blog', label: 'Blog' },
                { to: '/alumni', label: 'Alumni' },
                { to: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-white/90 hover:text-white transition-colors font-medium ${
                    location.pathname === item.to ? 'text-blue-400' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            {authLoading ? (
              <div className="text-white/70 animate-pulse">Loading...</div>
            ) : isLoggedIn ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 text-white/90 hover:text-white transition"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/50"
                  />
                  <div className="hidden md:block text-left">
                    <p className="font-medium text-sm">{user.name || user.email.split('@')[0]}</p>
                    <p className="text-xs text-blue-300">
                      {isPresident ? 'President' : currentRoleName}
                    </p>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-700">
                      <p className="font-medium">{user.name || 'User'}</p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full">
                        {isPresident ? 'President 2026' : currentRoleName}
                      </span>
                    </div>

                    <div className="py-2">
                      {canAccessDashboard && (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-slate-200 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          <LayoutDashboard size={18} />
                          Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-slate-200 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User size={18} />
                        Profile
                      </Link>

                      <Link
                        to="/activity"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-slate-200 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Activity size={18} />
                        My Activity
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 transition"
                      >
                        <LogOut size={18} />
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="lg:hidden mt-4 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col py-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/posts', label: 'Posts' },
                { to: '/events', label: 'Events' },
                { to: '/projects', label: 'Projects' },
                { to: '/resources', label: 'Resources' },
                { to: '/blog', label: 'Blog' },
                { to: '/alumni', label: 'Alumni' },
                { to: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-6 py-4 text-slate-200 hover:bg-slate-800 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-slate-700 mt-2 pt-2 px-6 pb-4">
                {authLoading ? (
                  <div className="text-slate-400 py-4">Loading...</div>
                ) : isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 py-4">
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/40"
                      />
                      <div>
                        <p className="font-medium">{user.name || user.email.split('@')[0]}</p>
                        <p className="text-sm text-blue-400">
                          {isPresident ? 'President' : currentRoleName}
                        </p>
                      </div>
                    </div>

                    {canAccessDashboard && (
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 py-4 text-blue-300 hover:text-blue-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard size={20} />
                        Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 py-4 text-slate-200 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={20} />
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 py-4 text-red-400 hover:text-red-300"
                    >
                      <LogOut size={20} />
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block py-4 text-center bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;