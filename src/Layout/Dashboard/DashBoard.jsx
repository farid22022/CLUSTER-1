import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Bell, MessageSquare, Users, 
  LogOut, Menu,  
  Calendar, Code, FileText, Settings, 
  Database, Mail, 
} from 'lucide-react';

import { getProfile, logout as apiLogout,  } from '../../api';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const adminMenu = [
    { to: "/dashboard", label: "Overview", icon: Home },
    { to: "/dashboard/meeting", label: "Meetings", icon: Calendar },
    { to: "/dashboard/emails", label: "Email Campaigns", icon: Mail },
    { to: "/dashboard/posts", label: "Posts", icon: FileText },
    { to: "/dashboard/events", label: "Events", icon: Calendar }, 
    { to: "/dashboard/projects", label: "Projects", icon: Code },
    { to: "/dashboard/blogs", label: "Blog Management", icon: FileText },
    { to: "/dashboard/resources", label: "Resources", icon: Database },
    { to: "/dashboard/alumni", label: "Alumni", icon: Users },
    { to: "/dashboard/contacts", label: "Contacts", icon: MessageSquare },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const { data } = await getProfile();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    window.addEventListener('focus', fetchUser);
    return () => window.removeEventListener('focus', fetchUser);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn("Logout request failed", err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      navigate('/login');
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const { first_name, last_name, username, email } = user;
    
    if (first_name && last_name) {
      return `${first_name[0]}${last_name[0]}`.toUpperCase();
    }
    if (username) {
      return username[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (!user) return 'Loading...';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username || user.email || 'User';
  };

  const getUserRole = () => {
    if (!user) return '';
    return user.role || user.is_staff ? 'Administrator' : 'User';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="md:relative z-50 w-64 h-screen bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 fixed md:sticky top-0"
      >
        <div className="flex flex-col h-full">
          
          {/* User Profile - Compact */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-sm font-semibold text-white shadow">
                {getUserInitials()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {getDisplayName()}
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                  {getUserRole()}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation - Compact */}
          <nav className="flex-1 p-2 overflow-y-auto">
            <ul className="space-y-1">
              {adminMenu.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium border border-blue-100 dark:border-blue-800' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium transition-all duration-200 border border-red-100 dark:border-red-800"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Compact */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">Dashboard</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last login: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[120px]">
                  {user.first_name || user.username || user.email?.split('@')[0] || 'User'}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-xs font-semibold text-white">
                {getUserInitials()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;