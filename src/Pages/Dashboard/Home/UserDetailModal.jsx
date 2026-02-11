// src/components/UserDetailModal.jsx
import { useState, useEffect } from 'react';
import { X, Mail, User,  Calendar, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { getUserById } from '../../../api'; // Adjust path as needed

export default function UserDetailModal({ userId, isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserById(userId);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load user details');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Could not fetch user information',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <User size={24} className="text-blue-600" />
            User Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading user information...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-slate-700">
                <div className="relative">
                  <img
                    src={user.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&size=96`}
                    alt={user.name || 'User'}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-slate-600"
                  />
                  {user.is_staff && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Staff
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name || 'Unnamed User'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Mail size={16} />
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Student ID</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{user.student_id || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{user.phone_number || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</label>
                    <p className="mt-1 text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(user.date_joined).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Role</label>
                    <p className="mt-1">
                      {user.current_role_display ? (
                        <span className={user.current_role_display.includes('President') ? 'text-yellow-600 font-bold' : 'text-blue-600'}>
                          {user.current_role_display}
                        </span>
                      ) : (
                        '—'
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                    <p className="mt-1">
                      {user.is_active ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-red-600 font-medium">Inactive</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff / Admin</label>
                    <p className="mt-1">
                      {user.is_staff ? (
                        <span className="text-purple-600 font-medium">Yes (Staff)</span>
                      ) : (
                        'No'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No user data available
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}