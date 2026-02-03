import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CheckCircle,
  Mail,
  Calendar,
  Search,
  Loader2,
  Users,
  UserCheck,
} from 'lucide-react';
import Swal from 'sweetalert2';

import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getPages,
} from '../../../api';
import { useNavigate } from 'react-router-dom';

const availablePages = [
  { key: 'home', label: 'Dashboard Home' },
  { key: 'events', label: 'Events' },
  { key: 'projects', label: 'Projects' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'resources', label: 'Resources' },
  { key: 'alumni', label: 'Alumni' },
  { key: 'contact', label: 'Contacts' },
  { key: 'email', label: 'Email/Communication', restricted: true },
];

const roleDisplayMap = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  LAYERED_ADMIN: 'Layered Admin',
};

const getRoleColor = (role) => ({
  SUPER_ADMIN: 'bg-gradient-to-r from-blue-600 to-indigo-700',
  ADMIN: 'bg-gradient-to-r from-blue-600 to-cyan-700',
  LAYERED_ADMIN: 'bg-gradient-to-r from-green-600 to-teal-700',
}[role] || 'bg-gray-600');

const getRoleIcon = (role) => ({
  SUPER_ADMIN: <Shield className="w-6 h-6" />,
  ADMIN: <Users className="w-6 h-6" />,
  LAYERED_ADMIN: <UserCheck className="w-6 h-6" />,
}[role] || null);

export default function HandleAdmin() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [pages, setPages] = useState([]); // backend pages: [{id, name, description?}]
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: '',
    role: 'LAYERED_ADMIN',
    assigned_pages: [], // array of lowercase keys like 'projects', 'blogs'
  });

  // TODO: Replace with real auth context later
  const currentUserRole = 'SUPER_ADMIN'; // temporary

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

  useEffect(() => {
    const loadData = async () => {
      try {
        const [adminsRes, pagesRes] = await Promise.all([getAdmins(), getPages()]);

        const mappedAdmins = adminsRes.data.map((user) => ({
          id: user.id,
          name: user.name || user.email.split('@')[0],
          email: user.email,
          photo: user.photo || '',
          role: user.role,
          displayRole: roleDisplayMap[user.role] || user.role,
          assigned_pages: user.assigned_pages || [], // array of IDs
          assigned_pages_details: user.assigned_pages_details || [],
          date_joined: user.date_joined ? user.date_joined.split('T')[0] : '—',
        }));

        setAdmins(mappedAdmins);
        setPages(pagesRes.data); // [{id, name, ...}]
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load data',
          text: 'Could not load administrators or pages.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.displayRole || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!formData.email.toLowerCase().endsWith('@cseku.ac.bd')) {
      errors.email = 'Email must end with @cseku.ac.bd';
    }

    // Password required only when creating
    if (!editingAdmin) {
      if (!formData.password.trim()) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
    }

    if (formData.role === 'LAYERED_ADMIN' && formData.assigned_pages.length === 0) {
      errors.assigned_pages = 'At least one page must be selected for Layered Admin';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const togglePage = (key) => {
    setFormData((prev) => ({
      ...prev,
      assigned_pages: prev.assigned_pages.includes(key)
        ? prev.assigned_pages.filter((k) => k !== key)
        : [...prev.assigned_pages, key],
    }));
  };

  const openModal = (admin = null) => {
    setFormErrors({});

    if (admin) {
      // Convert backend page IDs → frontend lowercase keys
      const selectedKeys = (admin.assigned_pages || [])
        .map((id) => {
          const page = pages.find((p) => p.id === id);
          return page ? page.name.toLowerCase() : null;
        })
        .filter(Boolean);

      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        password: '', // never prefill password
        photo: admin.photo || '',
        role: admin.role || 'LAYERED_ADMIN',
        assigned_pages: selectedKeys,
      });
      setEditingAdmin(admin);
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        photo: '',
        role: 'LAYERED_ADMIN',
        assigned_pages: [],
      });
      setEditingAdmin(null);
    }

    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      // Map selected keys → real page IDs
      const selectedPageIds = formData.assigned_pages
        .map((key) => {
          const page = pages.find((p) => p.name.toLowerCase() === key);
          return page?.id;
        })
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        photo: formData.photo.trim() || null,
        role: formData.role,
      };

      // Only SUPER_ADMIN can change role to SUPER_ADMIN or assign pages
      if (isSuperAdmin) {
        if (formData.role === 'LAYERED_ADMIN') {
          payload.assigned_pages = selectedPageIds;
        } else {
          payload.assigned_pages = [];
        }

        // Password on create is required, on update is optional
        if (!editingAdmin) {
          payload.password = formData.password.trim();
        } else if (formData.password.trim()) {
          payload.password = formData.password.trim();
        }
      }

      let response;

      if (editingAdmin) {
        response = await updateAdmin(editingAdmin.id, payload);
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: 'Administrator updated successfully',
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        response = await createAdmin(payload);
        Swal.fire({
          icon: 'success',
          title: 'Created',
          text: 'New administrator created successfully',
          timer: 1800,
          showConfirmButton: false,
        });
      }

      // Refresh full list (most reliable way)
      const freshAdmins = await getAdmins();
      setAdmins(
        freshAdmins.data.map((u) => ({
          id: u.id,
          name: u.name || u.email.split('@')[0],
          email: u.email,
          photo: u.photo || '',
          role: u.role,
          displayRole: roleDisplayMap[u.role] || u.role,
          assigned_pages: u.assigned_pages || [],
          assigned_pages_details: u.assigned_pages_details || [],
          date_joined: u.date_joined ? u.date_joined.split('T')[0] : '—',
        }))
      );

      setShowModal(false);
    } catch (err) {
      console.error('Save failed:', err);

      let message = 'Failed to save administrator';

      if (err.response?.data) {
        const data = err.response.data;
        if (data.detail) {
          message = data.detail;
        } else if (typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          if (Array.isArray(data[firstKey])) {
            message = `${firstKey}: ${data[firstKey][0]}`;
          }
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (admin) => {
    if (admin.role === 'SUPER_ADMIN' && !isSuperAdmin) {
      Swal.fire({
        icon: 'warning',
        title: 'Not allowed',
        text: 'Only Super Admin can delete Super Admins.',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Administrator?',
      text: `Are you sure you want to delete ${admin.name || admin.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAdmin(admin.id);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Administrator removed successfully',
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to delete',
        text: err.response?.data?.detail || 'Something went wrong',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Administrators
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Control roles, permissions and page access
            </p>
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => openModal()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2 shadow-md transition"
            >
              <Users size={20} />
              Add New Admin
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>
        </div>

        {/* Grid of admins */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdmins.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No administrators found matching your search.
            </div>
          ) : (
            filteredAdmins.map((admin) => (
              <div
                key={admin.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700"
              >
                <div className={`h-2 ${getRoleColor(admin.role)}`} />
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <img
                      src={
                        admin.photo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          admin.name
                        )}&background=0D8ABC&color=fff&size=128`
                      }
                      alt={admin.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {admin.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-slate-300">
                        {getRoleIcon(admin.role)}
                        <span className="font-medium">{admin.displayRole}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 text-sm text-gray-700 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <Mail size={18} />
                      <span>{admin.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={18} />
                      <span>Joined: {admin.date_joined}</span>
                    </div>
                    {admin.role === 'LAYERED_ADMIN' &&
                      admin.assigned_pages_details?.length > 0 && (
                        <div className="flex items-start gap-3">
                          <CheckCircle size={18} className="mt-0.5" />
                          <div>
                            <span className="font-medium">Assigned Pages:</span>
                            <ul className="list-disc pl-6 mt-1 text-sm">
                              {admin.assigned_pages_details.map((page) => (
                                <li key={page.id}>{page.name}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openModal(admin)}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(admin)}
                      disabled={admin.role === 'SUPER_ADMIN' && !isSuperAdmin}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal - Create / Edit */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 30, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingAdmin ? 'Edit Administrator' : 'Create New Administrator'}
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                      } bg-white dark:bg-slate-800 focus:border-blue-500 outline-none transition`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-slate-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                      } bg-white dark:bg-slate-800 focus:border-blue-500 outline-none transition`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-slate-300">
                      {editingAdmin
                        ? 'New Password (leave blank to keep current)'
                        : 'Password *'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                      } bg-white dark:bg-slate-800 focus:border-blue-500 outline-none transition`}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  {/* Photo */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-slate-300">
                      Profile Photo URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  {/* Role - only super admin can change to SUPER_ADMIN */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-slate-300">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      disabled={editingAdmin?.role === 'SUPER_ADMIN' || !isSuperAdmin}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 outline-none transition"
                    >
                      <option value="SUPER_ADMIN" disabled={!isSuperAdmin}>
                        Super Admin
                      </option>
                      <option value="ADMIN">Admin</option>
                      <option value="LAYERED_ADMIN">Layered Admin</option>
                    </select>
                  </div>

                  {/* Assigned Pages - only shown for LAYERED_ADMIN and only editable by SUPER_ADMIN */}
                  {formData.role === 'LAYERED_ADMIN' && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                        Assigned Pages <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4 p-4 border rounded-xl bg-gray-50 dark:bg-slate-900/50 max-h-64 overflow-y-auto">
                        {availablePages
                          .filter((p) => !p.restricted || isSuperAdmin)
                          .map((page) => (
                            <label
                              key={page.key}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.assigned_pages.includes(page.key)}
                                onChange={() => togglePage(page.key)}
                                disabled={!isSuperAdmin}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                              />
                              <span className="text-sm text-gray-700 dark:text-slate-300">
                                {page.label}
                              </span>
                            </label>
                          ))}
                      </div>
                      {formErrors.assigned_pages && (
                        <p className="text-red-500 text-sm mt-2">{formErrors.assigned_pages}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 py-5 border-t dark:border-slate-700 flex gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={saving}
                    className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl font-medium transition disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition"
                  >
                    {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                    {editingAdmin ? 'Update Admin' : 'Create Admin'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}