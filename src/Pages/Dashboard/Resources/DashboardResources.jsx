// src/pages/dashboard/DashboardResources.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Edit, Trash2, Upload, CheckCircle,
  Clock, Check, X, Download, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  approveResource,
  rejectResource
} from '../../../api';

const getFormatColor = (format) => ({
  PDF: 'from-red-600 to-rose-700',
  Video: 'from-purple-600 to-violet-700',
  Article: 'from-blue-600 to-indigo-700',
  Link: 'from-emerald-600 to-teal-700'
}[format] || 'from-gray-600 to-slate-700');

export default function DashboardResources() {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    format: 'PDF',
    difficulty: 'Intermediate',
    link: '',
    restricted: false,
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});

const fetchResources = async () => {
  try {
    setLoading(true);
    const { data } = await getResources();
    setResources(
      data.map(r => ({
        ...r,
        approval_status: r.approval_status.toLowerCase()  // ← Add this to normalize
      }))
    );
  } catch (err) {
    console.error('Fetch resources failed:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load resources. Please check your connection.'
    });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchResources();
  }, []);

  const filtered = resources.filter(r =>
    [r.title, r.category, r.description ?? '']
      .some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pending  = filtered.filter(r => r.approval_status === 'pending');
  const approved = filtered.filter(r => r.approval_status === 'approved');
  const rejected = filtered.filter(r => r.approval_status === 'rejected');

  const openModal = (res = null) => {
    setEditingResource(res);
    setFormData(res ? {
      title: res.title || '',
      category: res.category || '',
      format: res.format || 'PDF',
      difficulty: res.difficulty || 'Intermediate',
      link: res.link || '',
      restricted: !!res.restricted,
      description: res.description || ''
    } : {
      title: '', category: '', format: 'PDF', difficulty: 'Intermediate',
      link: '', restricted: false, description: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.format) errors.format = 'Format is required';
    if (!formData.difficulty) errors.difficulty = 'Difficulty is required';
    if (!formData.link.trim()) {
      errors.link = 'Link is required';
    } else if (!/^https?:\/\//i.test(formData.link)) {
      errors.link = 'Link must start with http:// or https://';
    }
    if (!formData.description.trim()) errors.description = 'Description is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Swal.fire('Validation Error', 'Please fix the highlighted fields', 'warning');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      format: formData.format,
      difficulty: formData.difficulty,
      link: formData.link.trim(),
      restricted: formData.restricted,
      description: formData.description.trim()
      // Important: NO approval_status here — backend sets it to 'pending' on create
    };

    try {
      if (editingResource) {
        await updateResource(editingResource.id, payload);
        Swal.fire('Success', 'Resource updated successfully', 'success');
      } else {
        await createResource(payload);
        Swal.fire('Success', 'Resource submitted — pending admin approval', 'success');
      }
      fetchResources();
      setShowModal(false);
    } catch (err) {
      console.error('Save failed:', err);
      console.log('Server response:', err.response?.data);
      const errorMsg = err.response?.data?.detail ||
                       (err.response?.data && typeof err.response.data === 'object'
                        ? Object.entries(err.response.data)
                            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
                            .join('\n')
                        : 'Unknown error');
      Swal.fire('Error', errorMsg || 'Failed to save resource', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Resource?',
      text: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteResource(id);
        fetchResources();
        Swal.fire('Deleted', 'Resource has been removed', 'success');
      } catch (err) {
        console.error('Delete failed:', err.response?.data);
        Swal.fire('Error', 'Failed to delete resource', 'error');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveResource(id);
      fetchResources();
      Swal.fire('Approved', 'Resource is now visible to everyone', 'success');
    } catch (err) {
      console.error('Approve failed:', err.response?.data);
      Swal.fire('Error', 'Failed to approve resource', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectResource(id);
      fetchResources();
      Swal.fire('Rejected', 'Resource has been rejected', 'success');
    } catch (err) {
      console.error('Reject failed:', err.response?.data);
      Swal.fire('Error', 'Failed to reject resource', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            Manage Resources
          </h1>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg text-sm transition-colors">
              <Upload size={16} /> Import CSV
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg shadow text-sm transition-all"
            >
              <CheckCircle size={16} /> Add Resource
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title, category, or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Pending */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-yellow-700 dark:text-yellow-400">
            <Clock size={24} /> Pending Resources ({pending.length})
          </h2>
          <ResourceTable
            resources={pending}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={openModal}
            onDelete={handleDelete}
            showActions={{ approve: true, reject: true }}
          />
        </section>

        {/* Approved */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-green-700 dark:text-green-400">
            <CheckCircle size={24} /> Approved Resources ({approved.length})
          </h2>
          <ResourceTable
            resources={approved}
            onEdit={openModal}
            onDelete={handleDelete}
            showActions={{ approve: false, reject: false }}
          />
        </section>

        {/* Rejected */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-red-700 dark:text-red-400">
            <X size={24} /> Rejected Resources ({rejected.length})
          </h2>
          <ResourceTable
            resources={rejected}
            onEdit={openModal}
            onDelete={handleDelete}
            showActions={{ approve: false, reject: false }}
          />
        </section>
      </div>

      {/* ──────────────────────────────────────────────── */}
      {/* Resource Modal (Create / Edit) */}
      {/* ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingResource ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600 ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Resource title"
                  />
                  {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600 ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g. Tutorials, Competitive Programming"
                  />
                  {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                </div>

                {/* Format & Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Format</label>
                    <select
                      value={formData.format}
                      onChange={e => setFormData({ ...formData, format: e.target.value })}
                      className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    >
                      <option value="PDF">PDF</option>
                      <option value="Video">Video</option>
                      <option value="Article">Article</option>
                      <option value="Link">External Link</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Resource Link/URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={formData.link}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600 ${
                      formErrors.link ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/resource.pdf"
                  />
                  {formErrors.link && <p className="text-red-500 text-sm mt-1">{formErrors.link}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of the resource..."
                  />
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>

                {/* Restricted */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.restricted}
                    onChange={e => setFormData({ ...formData, restricted: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Restricted (only visible to logged-in users)
                  </span>
                </label>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow transition-all"
                  >
                    {editingResource ? 'Update Resource' : 'Submit Resource'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ────────────────────────────────────────────────
// Reusable Table Component
// ────────────────────────────────────────────────
function ResourceTable({ resources, onApprove, onReject, onEdit, onDelete, showActions }) {
  if (!resources?.length) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No resources in this category
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-200 dark:divide-slate-700">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Format</th>
            <th className="px-4 py-3">Difficulty</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
          {resources.map(r => (
            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{r.title}</td>
              <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{r.category}</td>
              <td className="px-4 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getFormatColor(r.format)} text-white`}>
                  {r.format}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{r.difficulty}</td>
              <td className="px-4 py-4 flex gap-2">
                {showActions?.approve && (
                  <button
                    onClick={() => onApprove?.(r.id)}
                    className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/30 transition-colors"
                    title="Approve"
                  >
                    <Check size={16} className="text-green-700 dark:text-green-400" />
                  </button>
                )}
                {showActions?.reject && (
                  <button
                    onClick={() => onReject?.(r.id)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                    title="Reject"
                  >
                    <X size={16} className="text-red-700 dark:text-red-400" />
                  </button>
                )}
                <button
                  onClick={() => onEdit?.(r)}
                  className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors"
                  title="Edit"
                >
                  <Edit size={16} className="text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={() => onDelete?.(r.id, r.title)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}