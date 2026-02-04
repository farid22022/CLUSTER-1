
// import { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import clusterLogo from '../../../public/logo/cluster.png';
// import profileImage from '../../../public/logo/profile.jpg';

// // ── Import real API methods ────────────────────────────────────────
// import {
//   getProfile,
//   logout as apiLogout,
// } from '../../api';   

// const NavBar = () => {
//   const [isMenuOpen, setIsMenuOpen]     = useState(false);
//   const [scrolled, setScrolled]         = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [user, setUser]                 = useState(null);
//   const [loading, setLoading]           = useState(true);

//   const location  = useLocation();
//   const navigate  = useNavigate();

//   // Check auth status & fetch profile on mount + when token changes
//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem('access_token');   
//       if (!token) {
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const { data } = await getProfile();
//         setUser(data);
//       } catch (err) {
//         console.error("Failed to fetch profile", err);
//         // 401 → interceptor already redirects to /login
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();

//     // Optional: poll / re-check when coming back to tab (focus)
//     window.addEventListener('focus', fetchUser);
//     return () => window.removeEventListener('focus', fetchUser);
//   }, []);

//   // Scroll effect
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = () => {
//       setIsMenuOpen(false);
//       setProfileDropdownOpen(false);
//       setActiveDropdown(null);
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   const toggleMenu = (e) => {
//     e.stopPropagation();
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const toggleProfileDropdown = (e) => {
//     e.stopPropagation();
//     setProfileDropdownOpen(prev => !prev);
//   };

//   const handleLogout = async () => {
//     try {
//       await apiLogout();
//     } catch (err) {
//       console.warn("Logout request failed", err);
//     } finally {
//       // Always clear local storage
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       setUser(null);
//       setProfileDropdownOpen(false);
//       navigate('/login');
//     }
//   };

//   const isLoggedIn   = !!user;
//   const displayName  = user?.username || user?.email?.split('@')[0] || user?.name || 'User';
//   const isStudent    = user?.role === 'STUDENT';

//   // navLinks array (unchanged)
//   const navLinks = [
//     { path: '/',        label: 'Home' },
//     { path: '/posts',   label: 'Posts' },
//     { path: '/events',  label: 'Events' },
//     { path: '/projects',label: 'Projects' },
//     { path: '/resources',label: 'Resources' },
//     { path: '/blog',    label: 'Blog' },
//     { path: '/alumni',  label: 'Alumni' },
//     { path: '/contact', label: 'Contact' },
//   ];

//   return (
//     <nav
//       className={`fixed w-full top-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? 'bg-gradient-to-r from-blue-800 to-indigo-900 backdrop-blur-sm py-4'
//           : 'bg-black shadow-lg py-2'
//       }`}
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center">

//           {/* Logo */}
//           <button onClick={() => navigate('/')} className="flex items-center space-x-2">
//             <img
//               src={clusterLogo}
//               alt="CLUSTER Logo"
//               className="h-10 md:h-12 transition-all duration-300"
//             />
//             <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
//               CLUSTER
//             </span>
//           </button>

//           {/* Desktop nav links */}
//           <div className="hidden lg:flex flex-1 justify-center space-x-2">
//             {navLinks.map((link) => (
//               <motion.div
//                 key={link.path}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <Link
//                   to={link.path}
//                   className={`px-4 py-3 text-lg font-medium transition-colors ${
//                     scrolled
//                       ? 'text-white hover:text-blue-200'
//                       : 'text-white hover:text-gray-300'
//                   } ${location.pathname === link.path ? 'text-blue-300 underline underline-offset-8' : ''}`}
//                 >
//                   {link.label}
//                 </Link>
//               </motion.div>
//             ))}
//           </div>

//           {/* Desktop right side – Login / Profile */}
//           <div className="hidden lg:flex items-center">
//             {loading ? (
//               <div className="text-white/70">Loading...</div>
//             ) : isLoggedIn ? (
//               <div className="relative">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={toggleProfileDropdown}
//                   className="flex items-center gap-3 text-white hover:text-blue-200 transition"
//                 >
//                   <img
//                     src={profileImage}
//                     alt="Profile"
//                     className="h-10 w-10 rounded-full object-cover border-2 border-white/70 shadow-sm"
//                   />
//                   <span className="font-medium">{displayName}</span>
//                   {isStudent && (
//                     <span className="px-2 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full">
//                       Student
//                     </span>
//                   )}
//                 </motion.button>

//                 {/* Dropdown */}
//                 {profileDropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
//                   >
//                     {/* Profile Header */}
//                     <div className="px-5 py-4 border-b bg-gray-50">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="font-semibold text-gray-900">{displayName}</p>
//                           <p className="text-sm text-gray-500">{user?.email || '—'}</p>
//                         </div>
//                         {isStudent && (
//                           <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
//                             Student
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Dashboard Link */}
//                     <Link
//                       to="/dashboard"
//                       className="flex items-center gap-3 px-5 py-3.5 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition border-b border-gray-100"
//                       onClick={() => setProfileDropdownOpen(false)}
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                       </svg>
//                       <span>Dashboard</span>
//                     </Link>

//                     {/* Student Profile Link - Only shown for STUDENT role */}
//                     {isStudent && (
//                       <Link
//                         to="/student-profile"
//                         className="flex items-center gap-3 px-5 py-3.5 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition border-b border-gray-100"
//                         onClick={() => setProfileDropdownOpen(false)}
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                         <span>Student Profile</span>
//                       </Link>
//                     )}

//                     {/* Logout Button */}
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-5 py-3.5 text-red-600 hover:bg-red-50 transition font-medium flex items-center gap-3"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                       </svg>
//                       <span>Log Out</span>
//                     </button>
//                   </motion.div>
//                 )}
//               </div>
//             ) : (
//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Link
//                   to="/login"
//                   className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
//                 >
//                   Login
//                 </Link>
//               </motion.div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="lg:hidden">
//             <button
//               onClick={toggleMenu}
//               className="text-white p-1"
//               aria-label="Toggle menu"
//             >
//               {isMenuOpen ? (
//                 <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               ) : (
//                 <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* ── Mobile Menu ──────────────────────────────────────────────── */}
//         <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen py-4' : 'max-h-0'}`}>
//           <div className="bg-gradient-to-b from-blue-900 to-indigo-950 rounded-xl shadow-2xl mx-2">
//             {navLinks.map(link => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`block px-6 py-4 text-white border-b border-blue-800/40 last:border-0 hover:bg-blue-800/40 transition ${
//                   location.pathname === link.path ? 'text-blue-300 font-semibold' : ''
//                 }`}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {link.label}
//               </Link>
//             ))}

//             {/* Auth section in mobile */}
//             <div className="border-t border-blue-800/60 mt-2 pt-3 px-6 pb-4">
//               {loading ? (
//                 <div className="text-blue-200">Loading...</div>
//               ) : isLoggedIn ? (
//                 <>
//                   <div className="text-white font-medium mb-3 flex items-center gap-3">
//                     <img src={profileImage} alt="" className="h-10 w-10 rounded-full object-cover border border-white/40" />
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <span>{displayName}</span>
//                         {isStudent && (
//                           <span className="px-2 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full">
//                             Student
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-sm text-blue-200">{user?.email}</p>
//                     </div>
//                   </div>
                  
//                   <Link
//                     to="/dashboard"
//                     className="flex items-center gap-3 py-3 text-blue-300 hover:text-white"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                     </svg>
//                     <span>Dashboard</span>
//                   </Link>

//                   {/* Student Profile Link in Mobile - Only shown for STUDENT role */}
//                   {isStudent && (
//                     <Link
//                       to="/student-profile"
//                       className="flex items-center gap-3 py-3 text-blue-300 hover:text-white"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       <span>Student Profile</span>
//                     </Link>
//                   )}

//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-3 py-3 text-red-300 hover:text-red-100 w-full text-left"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                     </svg>
//                     <span>Log Out</span>
//                   </button>
//                 </>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="block py-3.5 px-5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-center font-medium"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import clusterLogo from '../../../public/logo/cluster.png';
import profileImage from '../../../public/logo/profile.jpg';

// ── Import real API methods ────────────────────────────────────────
import {
  getProfile,
  logout as apiLogout,
} from '../../api';   

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser]                 = useState(null);
  const [loading, setLoading]           = useState(true);

  const location  = useLocation();
  const navigate  = useNavigate();

  // Check auth status & fetch profile on mount + when token changes
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');   
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await getProfile();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        // 401 → interceptor already redirects to /login
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Optional: poll / re-check when coming back to tab (focus)
    window.addEventListener('focus', fetchUser);
    return () => window.removeEventListener('focus', fetchUser);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
      setProfileDropdownOpen(false);
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setProfileDropdownOpen(prev => !prev);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn("Logout request failed", err);
    } finally {
      // Always clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setProfileDropdownOpen(false);
      navigate('/login');
    }
  };

  const isLoggedIn   = !!user;
  const displayName  = user?.username || user?.email?.split('@')[0] || user?.name || 'User';
  const isStudent    = user?.role === 'STUDENT';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  // Determine which links to show based on role
  const showDashboard = isSuperAdmin; // Dashboard for admin/moderator
  const showProfile = true; // Profile for everyone (including students)

  // navLinks array (unchanged)
  const navLinks = [
    { path: '/',        label: 'Home' },
    { path: '/posts',   label: 'Posts' },
    { path: '/events',  label: 'Events' },
    { path: '/projects',label: 'Projects' },
    { path: '/resources',label: 'Resources' },
    { path: '/blog',    label: 'Blog' },
    { path: '/alumni',  label: 'Alumni' },
    { path: '/contact', label: 'Contact' },
  ];

  // Get role color for badge
  const getRoleColor = () => {
    if (isSuperAdmin) return 'bg-red-500/20 text-red-200 border-red-300/30';
    
    if (isStudent) return 'bg-blue-500/20 text-blue-200 border-blue-300/30';
    return 'bg-gray-500/20 text-gray-200 border-gray-300/30';
  };

  // Get role display name
  const getRoleDisplay = () => {
    if (isSuperAdmin) return 'Super Admin';
    if (isStudent) return 'Student';
    return user?.role_display || 'User';
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

          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <img
              src={clusterLogo}
              alt="CLUSTER Logo"
              className="h-10 md:h-12 transition-all duration-300"
            />
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
              CLUSTER
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden lg:flex flex-1 justify-center space-x-2">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={link.path}
                  className={`px-4 py-3 text-lg font-medium transition-colors ${
                    scrolled
                      ? 'text-white hover:text-blue-200'
                      : 'text-white hover:text-gray-300'
                  } ${location.pathname === link.path ? 'text-blue-300 underline underline-offset-8' : ''}`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop right side – Login / Profile */}
          <div className="hidden lg:flex items-center">
            {loading ? (
              <div className="text-white/70">Loading...</div>
            ) : isLoggedIn ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-3 text-white hover:text-blue-200 transition"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover border-2 border-white/70 shadow-sm"
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{displayName}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${getRoleColor()}`}>
                      {getRoleDisplay()}
                    </span>
                  </div>
                </motion.button>

                {/* Dropdown */}
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                  >
                    {/* Profile Header */}
                    <div className="px-5 py-4 border-b bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{displayName}</p>
                          <p className="text-sm text-gray-500">{user?.email || '—'}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          isSuperAdmin 
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : isStudent
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {getRoleDisplay()}
                        </span>
                      </div>
                    </div>

                    {/* Dashboard Link - Only for Admin/Moderator */}
                    {showDashboard && (
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-5 py-3.5 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition border-b border-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Dashboard</span>
                        {isSuperAdmin && (
                          <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                            Admin
                          </span>
                        )}
                      </Link>
                    )}

                    {/* Profile Link - For everyone (including students) */}
                    {showProfile && (
                      <Link
                        to={isStudent ? "/student-profile" : "/profile"}
                        className="flex items-center gap-3 px-5 py-3.5 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition border-b border-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{isStudent ? "Student Profile" : "Profile"}</span>
                      </Link>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3.5 text-red-600 hover:bg-red-50 transition font-medium flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-white p-1"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────────────────── */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen py-4' : 'max-h-0'}`}>
          <div className="bg-gradient-to-b from-blue-900 to-indigo-950 rounded-xl shadow-2xl mx-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-6 py-4 text-white border-b border-blue-800/40 last:border-0 hover:bg-blue-800/40 transition ${
                  location.pathname === link.path ? 'text-blue-300 font-semibold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth section in mobile */}
            <div className="border-t border-blue-800/60 mt-2 pt-3 px-6 pb-4">
              {loading ? (
                <div className="text-blue-200">Loading...</div>
              ) : isLoggedIn ? (
                <>
                  <div className="text-white font-medium mb-3 flex items-center gap-3">
                    <img src={profileImage} alt="" className="h-10 w-10 rounded-full object-cover border border-white/40" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{displayName}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${getRoleColor()}`}>
                          {getRoleDisplay()}
                        </span>
                      </div>
                      <p className="text-sm text-blue-200">{user?.email}</p>
                    </div>
                  </div>
                  
                  {/* Dashboard Link - Only for Admin/Moderator */}
                  {showDashboard && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 py-3 text-blue-300 hover:text-white border-b border-blue-800/40"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Dashboard</span>
                      {isSuperAdmin && (
                        <span className="ml-auto px-2 py-0.5 bg-red-500/20 text-red-200 text-xs rounded-full">
                          Admin
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Profile Link - For everyone (including students) */}
                  {showProfile && (
                    <Link
                      to={isStudent ? "/student-profile" : "/profile"}
                      className="flex items-center gap-3 py-3 text-blue-300 hover:text-white border-b border-blue-800/40"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{isStudent ? "Student Profile" : "Profile"}</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-3 text-red-300 hover:text-red-100 w-full text-left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block py-3.5 px-5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-center font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;