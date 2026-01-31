// src/pages/dashboard/DashboardBlogs.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, Edit3, Trash, Upload, CheckCircle,
  Tag, Calendar, User, Image as ImageIcon, Lock, Unlock, Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import {
  getBlogs, createBlog, updateBlog, deleteBlog
} from '../../../api'; // Adjust path to your API file

const getBlogColor = (category) => ({
  Tutorial: 'bg-gradient-to-r from-blue-600 to-indigo-700',
  Research: 'bg-gradient-to-r from-purple-600 to-violet-700',
  Event: 'bg-gradient-to-r from-green-600 to-teal-700'
}[category] || 'bg-gray-600');

const getBlogIcon = (category) => ({
  Tutorial: <FileText className="w-9 h-9" />,
  Research: <Tag className="w-9 h-9" />,
  Event: <Calendar className="w-9 h-9" />
}[category]);

// ────────────────────────────────────────────────
// CSV Export
// ────────────────────────────────────────────────
const exportToCSV = (blogsToExport, filename = 'Blogs') => {
  if (blogsToExport.length === 0) {
    Swal.fire('No Data', 'No blogs to export.', 'info');
    return;
  }

  const headers = [
    'Title', 'Category', 'Tags', 'Author', 'Date', 'Excerpt',
    'Image', 'Restricted'
  ];

  const rows = blogsToExport.map(b => [
    `"${(b.title || '').replace(/"/g, '""')}"`,
    `"${(b.category || '').replace(/"/g, '""')}"`,
    `"${(b.tags || []).join(', ')}"`,
    `"${(b.author || '').replace(/"/g, '""')}"`,
    `"${(b.date || '').replace(/"/g, '""')}"`,
    `"${(b.excerpt || '').replace(/"/g, '""')}"`,
    `"${(b.image || '').replace(/"/g, '""')}"`,
    `"${b.restricted ? 'Yes' : 'No'}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  Swal.fire('Exported!', `${blogsToExport.length} blog(s) exported.`, 'success');
};

export default function DashboardBlogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [formData, setFormData] = useState({
    title: '', category: '', tags: '', author: '', date: '',
    excerpt: '', image: '', restricted: false
  });

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await getBlogs();
        setBlogs(data);
      } catch (err) {
        Swal.fire('Error', 'Failed to load blogs', 'error',err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(b =>
    (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ────────────────────────────────────────────────
  // CSV Import
  // ────────────────────────────────────────────────
  const handleCSVImport = () => {
    Swal.fire({
      title: 'Import Blogs from CSV',
      text: 'Upload CSV file',
      input: 'file',
      inputAttributes: { accept: '.csv' },
      showCancelButton: true,
      confirmButtonText: 'Import',
      showLoaderOnConfirm: true,
      preConfirm: file => new Promise((resolve, reject) => {
        if (!file) return reject('No file selected');

        Papa.parse(file, {
          header: true,
          skipEmptyLines: 'greedy',
          transformHeader: h => h.trim().toLowerCase(),
          complete: result => {
            if (result.errors.length) {
              reject(result.errors.map(e => e.message).join('; '));
              return;
            }
            if (!result.data.length) return reject('CSV is empty');

            const valid = result.data
              .filter(row => row.title?.trim() && row.category?.trim())
              .map(row => {
                let parsedDate = '';
                const rawDate = row.date?.trim();

                if (rawDate) {
                  // Try to parse common formats like "May 15, 2025"
                  const dateObj = new Date(rawDate);
                  if (!isNaN(dateObj.getTime())) {
                    parsedDate = dateObj.toISOString().split('T')[0]; // → "2025-05-15"
                  } else {
                    // Fallback: if parsing fails, keep as-is (backend will reject)
                    parsedDate = rawDate;
                  }
                }

                return {
                  title: row.title?.trim() || 'Untitled Blog',
                  category: row.category?.trim() || 'Uncategorized',
                  tags: row.tags 
                    ? row.tags.split(/[,;]/).map(t => t.trim()).filter(Boolean) 
                    : [],
                  author: row.author?.trim() || 'Anonymous',
                  date: parsedDate,                     // ← fixed!
                  excerpt: row.excerpt?.trim() || 'No excerpt provided',
                  image: row.image?.trim() || '',
                  restricted: row.restricted?.toLowerCase() === 'yes' ||
                              row.restricted?.toLowerCase() === 'true' ||
                              row.restricted === true
                };
              })

            if (!valid.length) reject('No valid rows (title and category required)');
            resolve(valid);
          },
          error: err => reject(err.message)
        });
      })
    }).then(result => {
      if (result.isConfirmed) importFromCSV(result.value);
    }).catch(err => {
      if (err && err !== 'cancel') {
        Swal.fire('Import Failed', String(err), 'error');
      }
    });
  };

  const importFromCSV = async (rows) => {
    try {
      const newBlogs = [];
      for (const row of rows) {
        try {
          const { data } = await createBlog(row);
          newBlogs.push(data);
        } catch (singleErr) {
          console.error('Failed row:', row, singleErr.response?.data);
        }
      }
      if (newBlogs.length > 0) {
        setBlogs(prev => [...prev, ...newBlogs]);
        Swal.fire('Imported!', `${newBlogs.length} blog(s) added.`, 'success');
      }
    } catch (err) {
      Swal.fire('Import Error', err.message || 'Failed to import', 'error');
    }
  };

  // ────────────────────────────────────────────────
  // Modal Handlers
  // ────────────────────────────────────────────────
  const openModal = (blog = null) => {
    setEditingBlog(blog);
    if (blog) {
      setFormData({
        title: blog.title || '',
        category: blog.category || '',
        tags: (blog.tags || []).join(', '),
        author: blog.author || '',
        date: blog.date || '',
        excerpt: blog.excerpt || '',
        image: blog.image || '',
        restricted: !!blog.restricted
      });
    } else {
      setFormData({
        title: '', category: '', tags: '', author: '', date: '',
        excerpt: '', image: '', restricted: false
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const errors = [];
    if (!formData.title?.trim()) errors.push('Title');
    if (!formData.category?.trim()) errors.push('Category');
    if (!formData.author?.trim()) errors.push('Author');
    if (!formData.date?.trim()) errors.push('Date');
    if (!formData.excerpt?.trim()) errors.push('Excerpt');

    if (errors.length > 0) {
      Swal.fire({
        title: 'Missing Fields',
        html: errors.map(e => `• ${e}`).join('<br>'),
        icon: 'error'
      });
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      author: formData.author.trim(),
      date: formData.date.trim(),
      excerpt: formData.excerpt.trim(),
      image: formData.image?.trim() || '',
      restricted: formData.restricted
    };

    try {
      let updatedBlogs;
      if (editingBlog) {
        const { data } = await updateBlog(editingBlog.id, payload);
        updatedBlogs = blogs.map(b => b.id === data.id ? data : b);
        Swal.fire('Success', 'Blog updated!', 'success');
      } else {
        const { data } = await createBlog(payload);
        updatedBlogs = [...blogs, data];
        Swal.fire('Success', 'Blog created!', 'success');
      }
      setBlogs(updatedBlogs);
      setShowModal(false);
      setEditingBlog(null);
    } catch (err) {
      console.error(err);
      let msg = 'Failed to save blog.';
      if (err.response?.data) msg = JSON.stringify(err.response.data, null, 2);
      Swal.fire('Error', msg, 'error');
    }
  };

  const confirmDelete = async (blog) => {
    const result = await Swal.fire({
      title: 'Delete Blog?',
      text: `Delete "${blog.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(blog.id);
        setBlogs(prev => prev.filter(b => b.id !== blog.id));
        Swal.fire('Deleted!', 'Blog removed.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete blog', 'error',err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 md:p-8">
      <div className="flex flex-col bg-gray-50 dark:bg-slate-950 sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          Manage Blogs
        </h1>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <motion.button
          onClick={handleCSVImport}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl flex items-center gap-2 text-sm font-medium"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Upload size={16} /> Import CSV
        </motion.button>
        <motion.button
          onClick={() => exportToCSV(filteredBlogs)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Download size={16} /> Export CSV
        </motion.button>
        <motion.button
          onClick={() => openModal()}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <CheckCircle size={16} /> Add Blog
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading blogs...</div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          No blogs found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map(blog => (
            <motion.div
              key={blog.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
            >
              <div className={`${getBlogColor(blog.category)} px-5 py-3 text-white flex items-center gap-3`}>
                {getBlogIcon(blog.category)}
                <h4 className="font-bold text-lg truncate">{blog.title}</h4>
              </div>

              <div className="p-4 space-y-3 text-sm">
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{blog.excerpt}</p>

                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Tag size={16} /> {blog.category}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <User size={16} /> {blog.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> {blog.date}
                  </div>
                </div>

                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs pt-1">
                  {blog.restricted ? (
                    <Lock size={16} className="text-red-500" />
                  ) : (
                    <Unlock size={16} className="text-green-500" />
                  )}
                  <span>{blog.restricted ? 'Restricted' : 'Public'}</span>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <motion.button
                    onClick={() => openModal(blog)}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
                  </motion.button>
                  <motion.button
                    onClick={() => confirmDelete(blog)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Trash size={18} className="text-red-600 dark:text-red-400" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 40 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingBlog ? 'Edit Blog' : 'Create Blog'}
                </h3>
              </div>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Blog title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Tutorial"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="AI, Python, ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Author <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Excerpt <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[140px]"
                      placeholder="Short summary..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL / Path</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="/images/blog.jpg or https://..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="restricted"
                      checked={formData.restricted}
                      onChange={e => setFormData({ ...formData, restricted: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="restricted" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Restricted (login required)
                    </label>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-gray-200 dark:border-slate-700 flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  {editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}