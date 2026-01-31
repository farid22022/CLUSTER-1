
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Bell, MessageSquare, Users, Shield, Utensils, 
  LogOut, Menu, ChevronRight, Terminal, BotOff, Calendar,
  Code,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = { name: "Professor Eng. Dr. Kazi Masudul Alam", role: "(Super Admin)" };
  const adminMenu = [
    { to: "/", label: "Home", icon: BotOff },
    { to: "/dashboard", label: "Dashboard Home", icon: Home },
    { to: "/dashboard/emails", label: "Send Emails", icon: Shield},
    { to: "/dashboard/events", label: "Events", icon: Calendar }, 
    { to: "/dashboard/projects", label: "Projects", icon: Code },
    { to: "/dashboard/blogs", label: "Blogs", icon: FileText },
    { to: "/dashboard/resources", label: "Resources", icon: Terminal },
    { to: "/dashboard/alumni", label: "Alumni", icon: Users },
    { to: "/dashboard/contact", label: "Contacts", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen  flex ">

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`md:relative z-50 w-80 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl sticky top-0`}
      >
        <div className="flex flex-col h-full">
          

          {/* User Profile */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-sm">{user.name}</h3>
                <p className="text-sm text-emerald-400">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {adminMenu.map((item, index) => (
                <li key={index}>
                  {item.subItems ? (
                    <div>
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-400 font-semibold bg-slate-800/50">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <ul className="ml-8 mt-2 space-y-1">
                        {item.subItems.map((sub, i) => (
                          <li key={i}>
                            <NavLink
                              to={sub.to}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                  isActive 
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                                    : 'hover:bg-slate-700 text-gray-300'
                                }`
                              }
                            >
                              <ChevronRight className="w-4 h-4" />
                              {sub.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30' 
                            : 'hover:bg-slate-700 text-gray-300'
                        }`
                      }
                    >
                      <item.icon className="w-6 h-6" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-6 border-t border-slate-700">
            <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold transition-all duration-300 shadow-lg">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 shadow-lg px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-bold text-gray-800 dark:text-white">Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
              <p className="font-bold text-gray-800 dark:text-white">{user.name.split(' ')[0]}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;