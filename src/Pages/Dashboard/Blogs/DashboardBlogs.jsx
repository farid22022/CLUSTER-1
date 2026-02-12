import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, Edit3, Trash, Upload, CheckCircle,
  Clock, Check, X, Download, AlertCircle, Tag, Calendar,
  User, Unlock, Lock, Eye, ThumbsUp, ThumbsDown
} from 'lucide-react';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  approveBlog,
  rejectBlog,
} from '../../../api';
const getCategoryColor = (category) => ({
  Tutorial: 'from-blue-600 to-indigo-700',
  Research: 'from-purple-600 to-violet-700',
  Event: 'from-green-600 to-teal-700',
  News: 'from-orange-500 to-amber-600',
}[category] || 'from-gray-600 to-gray-700');

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Tutorial': return <FileText className="w-6 h-6" />;
    case 'Research': return <AlertCircle className="w-6 h-6" />;
    case 'Event': return <Calendar className="w-6 h-6" />;
    case 'News': return <FileText className="w-6 h-6" />;
    default: return <FileText className="w-6 h-6" />;
  }
};

const exportToCSV = (items, filename, showNotification) => {
  if (!items?.length) {
    showNotification('info', 'No Data', 'Nothing to export.');
    return;
  }

  const headers = [
    'Title', 'Category', 'Tags', 'Author', 'Date',
    'Excerpt', 'Image', 'Restricted', 'Approval Status'
  ];

  const csvRows = items.map(item => [
    `"${(item.title || '').replace(/"/g, '""')}"`,
    `"${(item.category || '').replace(/"/g, '""')}"`,
    `"${(item.tags || []).join(', ')}"`,
    `"${(item.author || '').replace(/"/g, '""')}"`,
    `"${(item.date || '').replace(/"/g, '""')}"`,
    `"${(item.excerpt || '').replace(/"/g, '""')}"`,
    `"${(item.image || '').replace(/"/g, '""')}"`,
    `"${item.restricted ? 'Yes' : 'No'}"`,
    `"${item.approval_status || 'pending'}"`
  ].join(','));

  const csv = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  showNotification('success', 'Exported', `${items.length} item(s) exported`);
};

export default function DashboardBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    title: '', category: '', tags: '', author: '', date: '',
    excerpt: '', image: '', restricted: false, approval_status: 'pending'
  });

  const showNotification = (type, title, message, duration = 4000) => {
    setNotification({ type, title, message });
    if (duration > 0) setTimeout(() => setNotification(null), duration);
  };

const fetchBlogs = async () => {
  try {
    setLoading(true);
    const { data } = await getBlogs();
    setBlogs(
      data.map(b => ({
        ...b,
        approval_status: b.approval_status.toLowerCase()  // ← Add this to normalize
      }))
    );
  } catch (err) {
    showNotification('error', 'Error', 'Failed to load blogs', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filtered = blogs.filter(b =>
    [b.title, b.category, b.excerpt, b.author]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pending = filtered.filter(b => b.approval_status === 'pending');
  const approved = filtered.filter(b => b.approval_status === 'approved');
  const rejected = filtered.filter(b => b.approval_status === 'rejected');

  const openModal = (blog = null) => {
    setEditingBlog(blog);
    setFormData(blog ? {
      title: blog.title || '',
      category: blog.category || '',
      tags: (blog.tags || []).join(', '),
      author: blog.author || '',
      date: blog.date || '',
      excerpt: blog.excerpt || '',
      image: blog.image || '',
      restricted: !!blog.restricted,
      approval_status: blog.approval_status || 'pending'
    } : {
      title: '', category: '', tags: '', author: '', date: '',
      excerpt: '', image: '', restricted: false, approval_status: 'pending'
    });
    setShowModal(true);
  };

  const openPreviewModal = (blog) => {
    setSelectedBlog(blog);
    setShowPreviewModal(true);
  };

  const openApproveModal = (blog) => {
    setSelectedBlog(blog);
    setShowApproveModal(true);
  };

  const openRejectModal = (blog) => {
    setSelectedBlog(blog);
    setShowRejectModal(true);
  };

  const openDeleteModal = (blog) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  const handleSave = async () => {
    const required = ['title', 'category', 'author', 'date', 'excerpt'];
    const missing = required.filter(k => !formData[k]?.trim());

    if (missing.length) {
      showNotification('error', 'Required Fields',
        `Please fill: ${missing.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')}`
      );
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      author: formData.author.trim(),
      date: formData.date.trim(),
      excerpt: formData.excerpt.trim(),
      image: formData.image?.trim() || null,
      restricted: formData.restricted,
      approval_status: formData.approval_status
    };

    try {
      if (editingBlog) {
        await updateBlog(editingBlog.id, payload);
        showNotification('success', 'Updated', 'Blog updated');
      } else {
        await createBlog(payload);
        showNotification('success', 'Created', 'Blog created (pending approval)');
      }
      fetchBlogs();
      setShowModal(false);
    } catch (err) {
      showNotification('error', 'Error', err.response?.data?.detail || 'Failed to save');
    }
  };

  const handleApprove = async () => {
    try {
      await approveBlog(selectedBlog.id);
      fetchBlogs();
      showNotification('success', 'Approved', 'Blog is now visible publicly');
      setShowApproveModal(false);
    } catch {
      showNotification('error', 'Error', 'Failed to approve blog');
    }
  };

  const handleReject = async () => {
    try {
      await rejectBlog(selectedBlog.id);
      fetchBlogs();
      showNotification('success', 'Rejected', 'Blog has been rejected');
      setShowRejectModal(false);
    } catch {
      showNotification('error', 'Error', 'Failed to reject blog');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBlog(selectedBlog.id);
      fetchBlogs();
      showNotification('success', 'Deleted', 'Blog has been deleted');
      setShowDeleteModal(false);
    } catch {
      showNotification('error', 'Error', 'Failed to delete blog');
    }
  };

  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const rows = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              if (result.errors.length) reject(result.errors[0].message);

              const valid = result.data
                .filter(r => r.title?.trim() && r.category?.trim())
                .map(r => ({
                  title: r.title.trim(),
                  category: r.category.trim(),
                  tags: r.tags ? r.tags.split(/[,;]/).map(t => t.trim()).filter(Boolean) : [],
                  author: r.author?.trim() || 'Anonymous',
                  date: r.date ? new Date(r.date).toISOString().split('T')[0] : '',
                  excerpt: r.excerpt?.trim() || '',
                  image: r.image?.trim() || '',
                  restricted: ['yes', 'true', '1'].includes(String(r.restricted || '').toLowerCase()),
                  approval_status: 'pending'
                }));

              if (!valid.length) reject('No valid rows');
              resolve(valid);
            },
            error: err => reject(err)
          });
        });

        let success = 0;
        for (const row of rows) {
          try {
            await createBlog(row);
            success++;
          } catch {
            // Silently skip failed imports
          }
        }

        if (success > 0) {
          fetchBlogs();
          showNotification('success', 'Imported', `${success} blog(s) added (pending)`);
        } else {
          showNotification('warning', 'Import', 'No blogs imported');
        }
      } catch (err) {
        showNotification('error', 'Import Failed', err.message || 'Error');
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-lg shadow-lg border ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                  'bg-blue-50 border-blue-200 text-blue-800'
              } flex items-start gap-3`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="mt-0.5">
              {notification.type === 'success' ? <Check size={20} /> :
                notification.type === 'error' ? <X size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{notification.title}</p>
              <p className="text-sm mt-1">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)}>
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Blogs
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleImportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg text-sm">
              <Upload size={16} /> Import CSV
            </button>
            <button onClick={() => exportToCSV(filtered, 'all_blogs', showNotification)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm shadow-sm">
              <Download size={16} /> Export All
            </button>
            <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg shadow-md text-sm">
              <CheckCircle size={16} /> Add Blog
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-10 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search title, category, author..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Pending Blogs */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-3">
              <Clock size={24} /> Pending Blogs ({pending.length})
            </h2>
            <button onClick={() => exportToCSV(pending, 'pending_blogs', showNotification)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
              <Download size={16} /> Export
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pending.map(blog => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onEdit={() => openModal(blog)}
                onDelete={() => openDeleteModal(blog)}
                onApprove={() => openApproveModal(blog)}
                onReject={() => openRejectModal(blog)}
                onPreview={() => openPreviewModal(blog)}
                isPending
              />
            ))}
            {pending.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                No pending blogs
              </div>
            )}
          </div>
        </section>

        {/* Approved Blogs */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 flex items-center gap-3">
              <CheckCircle size={24} /> Approved Blogs ({approved.length})
            </h2>
            <button onClick={() => exportToCSV(approved, 'approved_blogs', showNotification)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
              <Download size={16} /> Export
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approved.map(blog => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onEdit={() => openModal(blog)}
                onDelete={() => openDeleteModal(blog)}
                onPreview={() => openPreviewModal(blog)}
              />
            ))}
            {approved.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                No approved blogs yet
              </div>
            )}
          </div>
        </section>

        {/* Rejected Blogs */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 flex items-center gap-3">
              <X size={24} /> Rejected Blogs ({rejected.length})
            </h2>
            <button onClick={() => exportToCSV(rejected, 'rejected_blogs', showNotification)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
              <Download size={16} /> Export
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rejected.map(blog => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onEdit={() => openModal(blog)}
                onDelete={() => openDeleteModal(blog)}
                onPreview={() => openPreviewModal(blog)}
              />
            ))}
            {rejected.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                No rejected blogs
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Blog Title"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Research">Research</option>
                      <option value="Event">Event</option>
                      <option value="News">News</option>
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Author <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Author Name"
                      required
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="technology, AI, web development"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Approval Status
                    </label>
                    <select
                      value={formData.approval_status}
                      onChange={e => setFormData({ ...formData, approval_status: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Excerpt */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Excerpt <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px]"
                      placeholder="Brief description of the blog..."
                      required
                    />
                  </div>

                  {/* Image URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Restricted */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.restricted}
                        onChange={e => setFormData({ ...formData, restricted: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Restricted Access
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Only logged-in users can view
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex gap-4 bg-gray-50 dark:bg-slate-900/50">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  {editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preview Blog</h2>
                <button onClick={() => setShowPreviewModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {selectedBlog.image && (
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-64 object-cover rounded-xl"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(selectedBlog.category)} text-white rounded-lg`}>
                      {selectedBlog.category}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${selectedBlog.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedBlog.approval_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {selectedBlog.approval_status}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{selectedBlog.title}</h3>

                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                      <User size={16} /> {selectedBlog.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} /> {selectedBlog.date}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedBlog.restricted ? <Lock size={16} /> : <Unlock size={16} />}
                      {selectedBlog.restricted ? 'Restricted' : 'Public'}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedBlog.excerpt}</p>

                  {selectedBlog.tags?.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedBlog.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowApproveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Approve Blog</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to approve <span className="font-semibold">&quot;{selectedBlog.title}&quot;</span>?
                </p>
              </div>

              <div className="p-6 flex gap-4">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <ThumbsDown className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reject Blog</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to reject <span className="font-semibold">&quot;{selectedBlog.title}&quot;</span>?
                </p>
              </div>

              <div className="p-6 flex gap-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Trash className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Blog</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete <span className="font-semibold">&quot;{selectedBlog.title}&quot;</span>? This action cannot be undone.
                </p>
              </div>

              <div className="p-6 flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Trash size={18} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// BlogCard Component
function BlogCard({ blog, onEdit, onDelete, onApprove, onReject, onPreview, isPending = false }) {
  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all"
      whileHover={{ y: -6 }}
    >
      <div className={`bg-gradient-to-r ${getCategoryColor(blog.category)} px-6 py-4 text-white flex items-center gap-3`}>
        {getCategoryIcon(blog.category)}
        <h3 className="font-semibold text-lg truncate">{blog.title}</h3>
      </div>

      <div className="p-5 space-y-4 text-sm">
        <p className="text-gray-700 dark:text-gray-300 line-clamp-3 min-h-[4.5rem]">
          {blog.excerpt || 'No excerpt'}
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Tag size={14} /> {blog.category}
          </div>
          <div className="flex items-center gap-1.5">
            <User size={14} /> {blog.author}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} /> {blog.date}
          </div>
        </div>

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.map((t, i) => (
              <span key={i} className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
          <div className="text-xs flex items-center gap-2">
            {blog.restricted ? (
              <><Lock size={14} className="text-red-500" /> Restricted</>
            ) : (
              <><Unlock size={14} className="text-green-500" /> Public</>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onPreview}
              className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
              title="Preview"
            >
              <Eye size={18} className="text-blue-600 dark:text-blue-400" />
            </button>

            {isPending && (
              <>
                <button
                  onClick={onApprove}
                  className="p-2 bg-green-100 hover:bg-green-200 rounded-lg"
                  title="Approve"
                >
                  <Check size={18} className="text-green-700" />
                </button>
                <button
                  onClick={onReject}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                  title="Reject"
                >
                  <X size={18} className="text-red-700" />
                </button>
              </>
            )}
            <button
              onClick={onEdit}
              className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
              title="Edit"
            >
              <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
              title="Delete"
            >
              <Trash size={18} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}