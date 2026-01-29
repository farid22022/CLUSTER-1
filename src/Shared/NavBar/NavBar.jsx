import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import clusterLogo from '../../../public/logo/cluster.png';
import profileImage from '../../../public/logo/profile.jpg'; // Added profile image import

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation(); // Added to track current route
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/projects', label: 'Projects' },
    { path: '/resources', label: 'Resources' },
    { path: '/blog', label: 'Blog' },
    { path: '/alumni', label: 'Alumni' },
    { path: '/contact', label: 'Contact' },
  ];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (e, index) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gradient-to-r from-blue-800 to-indigo-900 backdrop-blur-sm py-4'
          : 'bg-black shadow-lg py-2'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and CLUSTER text */}
          <button onClick={() => navigate('/')} className="flex items-center">
            <img
              src={clusterLogo}
              alt="CLUSTER Logo"
              className="h-10 md:h-12 mr-2 transition-all duration-300"
            />
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
              CLUSTER
            </span>
          </button>

          {/* Desktop Navigation (Center) */}
          <div className="hidden lg:flex flex-1 justify-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.path}
                  className={`px-4 py-3 flex items-center text-xl font-bold transition-colors relative ${
                    scrolled ? 'text-white hover:text-blue-200' : 'text-white hover:text-gray-300'
                  } ${location.pathname === link.path ? 'text-blue-200' : ''}`}
                >
                  {link.label}
                  {link.submenu && (
                    <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {location.pathname === link.path && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-1 bg-blue-200"
                      layoutId="underline"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>

                {/* Dropdown menu */}
                {link.submenu && activeDropdown === index && (
                  <div className="absolute left-0 mt-1 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-50">
                    <div className="py-1">
                      {link.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className="block px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Profile Image (Right) */}
          <div className="hidden lg:flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link to="/profile">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover border-2 border-white"
                />
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} transition-all duration-300 overflow-hidden`}>
          <div className="pt-2 pb-4 space-y-1 bg-blue-900 rounded-lg mt-2 shadow-xl">
            {[...navLinks, { path: '/profile', label: 'Profile' }].map((link, index) => (
              <div key={link.path} className="border-b border-blue-700/50 last:border-0">
                <div
                  className="flex justify-between items-center px-4 py-3"
                  onClick={(e) => (link.submenu ? toggleDropdown(e, index) : setIsMenuOpen(false))}
                >
                  <Link
                    to={link.path}
                    className={`text-white hover:text-blue-200 font-medium relative ${
                      location.pathname === link.path ? 'text-blue-200' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                    {location.pathname === link.path && (
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-1 bg-blue-200"
                        layoutId="mobile-underline"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                  {link.submenu && (
                    <button onClick={(e) => toggleDropdown(e, index)} className="text-white p-1">
                      <svg
                        className={`w-5 h-5 transform transition-transform ${
                          activeDropdown === index ? 'rotate-180' : ''
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Mobile dropdown menu */}
                {link.submenu && activeDropdown === index && (
                  <div className="pl-6 py-2 bg-blue-900/50">
                    {link.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block px-4 py-3 text-white/90 hover:text-white hover:bg-blue-700/30 rounded transition-colors ${
                          location.pathname === subItem.path ? 'text-blue-200' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subItem.label}
                        {location.pathname === subItem.path && (
                          <motion.div
                            className="absolute bottom-0 left-0 w-full h-1 bg-blue-200"
                            layoutId="mobile-underline"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;