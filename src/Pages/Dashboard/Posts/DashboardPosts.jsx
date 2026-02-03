// src/pages/dashboard/DashboardPosts.jsx
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Edit, Trash2, Plus, Share2,
} from 'lucide-react';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost
} from '../../../api';
import "@fontsource/noto-sans-bengali";

export default function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    media: '[]'
  });

  const [formErrors, setFormErrors] = useState({});

  const quillRef = useRef(null);           // ← important for preventing events
  const formRef = useRef(null);            // ← to prevent submit

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await getPosts();
      setPosts(data);
    } catch (err) {
      Swal.fire('Error', 'Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(p =>
    [p.title, p.content ?? '']
      .some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openModal = (post = null) => {
    setEditingPost(post);
    setFormData(post ? {
      title: post.title || '',
      slug: post.slug || '',
      content: post.content || '',
      media: JSON.stringify(post.media || [], null, 2)
    } : {
      title: '', slug: '', content: '', media: '[]'
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Prevent Enter key from submitting form when typing in inputs
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim()) errors.content = 'Content is required';

    try {
      const parsed = JSON.parse(formData.media);
      if (!Array.isArray(parsed)) {
        errors.media = 'Media must be an array []';
      }
    } catch (e) {
      errors.media = `Invalid JSON: ${e.message}`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();           // ← crucial

    if (!validateForm()) {
      Swal.fire('Validation Error', 'Please check the fields', 'warning');
      return;
    }

    let mediaArray;
    try {
      mediaArray = JSON.parse(formData.media);
    } catch {
      Swal.fire('Error', 'Media field contains invalid JSON', 'error');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      content: formData.content.trim(),
      media: mediaArray
    };

    try {
      if (editingPost) {
        await updatePost(editingPost.id, payload);
        Swal.fire('Success', 'Post updated', 'success');
      } else {
        await createPost(payload);
        Swal.fire('Success', 'Post created', 'success');
      }
      fetchPosts();
      setShowModal(false);
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.detail || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: `Delete "${title}"?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deletePost(id);
        Swal.fire('Deleted!', 'Post has been deleted.', 'success');
        fetchPosts();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete', 'error');
      }
    }
  };

  const handleShareToFacebook = (post) => {
    const postUrl = `https://your-domain.com/posts/${post.slug || post.id}`;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(shareUrl, 'fbShare', 'width=626,height=436');
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image', 'video'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Posts Dashboard</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2"
          >
            <Plus size={18} /> New Post
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
          <table className="w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredPosts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">{post.slug || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button onClick={() => openModal(post)} title="Edit">
                        <Edit size={18} className="text-blue-600 hover:text-blue-800" />
                      </button>
                      <button onClick={() => handleDelete(post.id, post.title)} title="Delete">
                        <Trash2 size={18} className="text-red-600 hover:text-red-800" />
                      </button>
                      <button onClick={() => handleShareToFacebook(post)} title="Share to Facebook">
                        <Share2 size={18} className="text-green-600 hover:text-green-800" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
              </div>

              <form
                ref={formRef}
                onSubmit={handleSave}
                onKeyDown={handleKeyDown}
                className="p-6 space-y-6"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 outline-none`}
                  />
                  {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Slug (optional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 outline-none"
                    placeholder="best-project-2025"
                  />
                </div>

                {/* Content - React Quill */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Content *</label>
                  <div className={`border ${formErrors.content ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} rounded-lg overflow-hidden bg-white dark:bg-slate-700`}>
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={formData.content}
                      onChange={(value) => setFormData({ ...formData, content: value })}
                      modules={modules}
                      formats={formats}
                      className="min-h-[280px] [&_.ql-container]:min-h-[220px]"
                    />
                  </div>
                  {formErrors.content && <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>}
                </div>

                {/* Media JSON */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Media (JSON array of objects)</label>
                  <textarea
                    value={formData.media}
                    onChange={e => setFormData({ ...formData, media: e.target.value })}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border font-mono text-sm ${formErrors.media ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 outline-none`}
                    placeholder={`Example:\n[\n  {"type": "photo", "url": "https://example.com/image.jpg"},\n  {"type": "video", "url": "https://youtube.com/watch?v=abc123"}\n]`}
                  />
                  {formErrors.media && <p className="mt-1 text-sm text-red-600">{formErrors.media}</p>}
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    Format: <code>[]</code> or array of objects with <code>type</code> (&quot;photo&quot;, &quot;video&quot;) and <code>url</code>
                  </p>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-slate-700">
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
                    {editingPost ? 'Update Post' : 'Create Post'}
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