
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, Edit3, Trash, Upload, CheckCircle,
  Clock, Check, X, Download, AlertCircle,Tag,Calendar,User,Unlock,Lock
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
  Event:    'from-green-600 to-teal-700',
  News:     'from-orange-500 to-amber-600',
}[category] || 'from-gray-600 to-gray-700');

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Tutorial': return <FileText className="w-6 h-6" />;
    case 'Research': return <AlertCircle className="w-6 h-6" />;
    case 'Event':    return <Calendar className="w-6 h-6" />;
    case 'News':     return <FileText className="w-6 h-6" />;
    default:         return <FileText className="w-6 h-6" />;
  }
};

// ────────────────────────────────────────────────
// CSV Export (now includes approval_status)
// ────────────────────────────────────────────────
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
    `"${(item.title     || '').replace(/"/g, '""')}"`,
    `"${(item.category  || '').replace(/"/g, '""')}"`,
    `"${(item.tags      || []).join(', ')}"`,
    `"${(item.author    || '').replace(/"/g, '""')}"`,
    `"${(item.date      || '').replace(/"/g, '""')}"`,
    `"${(item.excerpt   || '').replace(/"/g, '""')}"`,
    `"${(item.image     || '').replace(/"/g, '""')}"`,
    `"${item.restricted ? 'Yes' : 'No'}"`,
    `"${item.approval_status || 'pending'}"`
  ].join(','));

  const csv = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  showNotification('success', 'Exported', `${items.length} item(s) exported`);
};

export default function DashboardBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

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
      setBlogs(data);
    } catch (err) {
      showNotification('error', 'Error', 'Failed to load blogs');
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

  const pending    = filtered.filter(b => b.approval_status === 'pending');
  const approved   = filtered.filter(b => b.approval_status === 'approved');
  const rejected   = filtered.filter(b => b.approval_status === 'rejected');

  // ────────────────────────────────────────────────
  // Modal & CRUD
  // ────────────────────────────────────────────────
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

  const handleDelete = (id, title) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Blog?',
      message: `Are you sure you want to delete "${title}"?`,
      onConfirm: async () => {
        try {
          await deleteBlog(id);
          fetchBlogs();
          showNotification('success', 'Deleted', 'Blog removed');
        } catch {
          showNotification('error', 'Error', 'Failed to delete');
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleApprove = async (id) => {
    try {
      // await approveBlog(id);   // if you created the action
      // Temporary workaround using update:
      approveBlog(id);
      await updateBlog(id, { approval_status: 'approved' });
      fetchBlogs();
      showNotification('success', 'Approved', 'Blog is now visible publicly');
    } catch {
      showNotification('error', 'Error', 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      // await rejectBlog(id);
      await updateBlog(id, { approval_status: 'rejected' });
      fetchBlogs();
      showNotification('success', 'Rejected', 'Blog marked as rejected');
    } catch {
      showNotification('error', 'Error', 'Failed to reject');
    }
  };

  // ────────────────────────────────────────────────
  // CSV Import (basic version – you can enhance later)
  // ────────────────────────────────────────────────
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
                  restricted: ['yes','true','1'].includes(String(r.restricted||'').toLowerCase()),
                  approval_status: 'pending' // imported → pending
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
          } catch {}
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

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-lg shadow-lg border ${
              notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              notification.type === 'error'   ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            } flex items-start gap-3`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="mt-0.5">
              {notification.type === 'success' ? <Check size={20} /> :
               notification.type === 'error'   ? <X size={20} /> : <AlertCircle size={20} />}
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

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDialog({ isOpen: false })}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <AlertCircle className="text-red-500" /> {confirmDialog.title || 'Confirm Action'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {confirmDialog.message}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDialog({ isOpen: false })}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
                >
                  <Trash size={16} /> Delete
                </button>
              </div>
            </motion.div>
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
                onDelete={() => handleDelete(blog.id, blog.title)}
                onApprove={() => handleApprove(blog.id)}
                onReject={() => handleReject(blog.id)}
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
                onDelete={() => handleDelete(blog.id, blog.title)}
              />
            ))}
            {approved.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                No approved blogs yet
              </div>
            )}
          </div>
        </section>

        {/* Rejected Blogs (optional – can be collapsed) */}
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
                onDelete={() => handleDelete(blog.id, blog.title)}
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

      {/* Modal */}
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
              {/* ... same modal content as before, just make sure approval_status select is included ... */}
              <div className="p-6 space-y-6">
                {/* ... other fields ... */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Approval Status
                  </label>
                  <select
                    value={formData.approval_status}
                    onChange={e => setFormData({...formData, approval_status: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* ... rest of form ... */}
              </div>

              {/* buttons */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable Blog Card Component
function BlogCard({ blog, onEdit, onDelete, onApprove, onReject, isPending = false }) {
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
            {isPending && (
              <>
                <button onClick={onApprove} className="p-2 bg-green-100 hover:bg-green-200 rounded-lg" title="Approve">
                  <Check size={18} className="text-green-700" />
                </button>
                <button onClick={onReject} className="p-2 bg-red-100 hover:bg-red-200 rounded-lg" title="Reject">
                  <X size={18} className="text-red-700" />
                </button>
              </>
            )}
            <button onClick={onEdit} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg" title="Edit">
              <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
            </button>
            <button onClick={onDelete} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg" title="Delete">
              <Trash size={18} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}