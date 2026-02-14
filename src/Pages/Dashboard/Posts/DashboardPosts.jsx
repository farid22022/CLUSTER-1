



import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Share2,
  Image as ImageIcon,
  Video,
  X,
  Loader2,
} from 'lucide-react';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from '../../../api';
import "@fontsource/noto-sans-bengali";

// Quill wrapper to avoid findDOMNode warning
const QuillWrapper = forwardRef(({ value, onChange, modules, formats, placeholder, className }, ref) => {
  return (
    <div ref={ref} className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
});
QuillWrapper.displayName = 'QuillWrapper';

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
  });

  const [mediaItems, setMediaItems] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  const quillRef = useRef(null);
  const formRef = useRef(null);
  const cloudinaryScriptLoaded = useRef(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await getPosts();
      setPosts(data || []);
    } catch (err) {
      Swal.fire('Error', 'Failed to load posts', 'error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!cloudinaryScriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => {
        cloudinaryScriptLoaded.current = true;
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  const filteredPosts = posts.filter((p) =>
    [p.title ?? '', p.content ?? '']
      .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openModal = (post = null) => {
    setEditingPost(post);
    setFormData(
      post
        ? {
            title: post.title || '',
            slug: post.slug || '',
            content: post.content || '',
          }
        : { title: '', slug: '', content: '' }
    );
    setMediaItems(post?.media || []);
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  const openCloudinaryWidget = (resourceType = 'image') => {
    if (!cloudinaryScriptLoaded.current) {
      Swal.fire({
        title: 'Loading Uploader',
        text: 'Please wait a moment...',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (!window.cloudinary) {
      Swal.fire('Error', 'Upload service not available. Please refresh the page.', 'error');
      return;
    }

    if (resourceType === 'image') {
      setUploadingImages(true);
    } else {
      setUploadingVideos(true);
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dvpbeekmy',
        uploadPreset: 'project_submit',
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: resourceType === 'image' ? 20 : 5,
        resourceType: resourceType,
        clientAllowedFormats: resourceType === 'image'
          ? ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp']
          : ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv'],
        maxFileSize: resourceType === 'image' ? 5000000 : 50000000,
        folder: `posts/${resourceType}s`,
        styles: {
          palette: {
            window: '#FFFFFF',
            sourceBg: '#f4f4f5',
            windowBorder: '#90a0b3',
            tabIcon: '#000000',
            inactiveTabIcon: '#555a5f',
            menuIcons: '#555a5f',
            link: '#37474F',
            action: '#3399FF',
            inProgress: '#0433ff',
            complete: '#20b832',
            error: '#ff5254',
            textDark: '#000000',
            textLight: '#ffffff',
          },
        },
        text: {
          en: {
            queue: {
              title: 'Upload Queue',
              title_uploading_with_counter: 'Uploading {{num}} files',
            }
          }
        }
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error);
          Swal.fire('Upload Failed', 'An error occurred during upload', 'error');
          setUploadingImages(false);
          setUploadingVideos(false);
          return;
        }

        if (result.event === 'success') {
          const { resource_type, secure_url, public_id, format, duration, width, height } = result.info;
          const type = resource_type === 'video' ? 'video' : 'image';

          const newMediaItem = {
            type,
            url: secure_url,
            public_id,
            format,
            ...(resource_type === 'video' && { duration }),
            ...(width && { width }),
            ...(height && { height }),
          };

          setMediaItems((prev) => [...prev, newMediaItem]);

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `${type === 'image' ? 'Image' : 'Video'} uploaded`,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        }

        if (result.event === 'queues-end' || result.event === 'close') {
          setUploadingImages(false);
          setUploadingVideos(false);
        }

        if (result.event === 'abort') {
          setUploadingImages(false);
          setUploadingVideos(false);
          Swal.fire('Upload Cancelled', 'Upload was cancelled', 'info');
        }
      }
    );

    widget.open();
  };

  const removeMedia = (index) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim() || formData.content === '<p><br></p>') errors.content = 'Content is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire('Validation Error', 'Please fix required fields', 'warning');
      return;
    }

    const imagesUrls = mediaItems
    .filter(item => item.type === 'image' )
    .map(item => item.url);

  const videosUrls = mediaItems
    .filter(item => item.type === 'video')
    .map(item => item.url);

    const payload = {
     title: formData.title.trim(),    
   slug: formData.slug?.trim() || undefined,
   content: formData.content.trim(),
  images: imagesUrls,// only urls
  videos: videosUrls,
};

    try {
      if (editingPost) {
        await updatePost(editingPost.id, payload);
        Swal.fire('Success', 'Post updated successfully', 'success');
      } else {
        await createPost(payload);
        Swal.fire('Success', 'Post created successfully', 'success');
      }
      fetchPosts();
      setShowModal(false);
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.detail || 'Save failed. Please try again.', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: `Delete "${title}"?`,
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deletePost(id);
        Swal.fire('Deleted!', 'Post has been deleted.', 'success');
        fetchPosts();
      } catch {
        Swal.fire('Error', 'Failed to delete post', 'error');
      }
    }
  };

  const handleShareToFacebook = (post) => {
    const postUrl = `https://cluster-ku.web.app/posts/${post.slug || post.id}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      'fbShare',
      'width=626,height=436'
    );
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
    'video',
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Posts Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-all duration-200 active:scale-95"
          >
            <Plus size={18} /> New Post
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
          <table className="w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No posts match your search' : 'No posts found'}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <div className="max-w-xs truncate" title={post.title}>
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div className="max-w-xs truncate" title={post.slug}>
                        {post.slug || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => openModal(post)} 
                          title="Edit"
                          className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <Edit size={18} className="text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          title="Delete"
                          className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                        </button>
                        <button
                          onClick={() => handleShareToFacebook(post)}
                          title="Share to Facebook"
                          className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                          <Share2 size={18} className="text-green-600 dark:text-green-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                <form
                  ref={formRef}
                  onSubmit={handleSave}
                  onKeyDown={handleKeyDown}
                  className="p-6 space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-900 dark:text-white">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                      } bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors`}
                      placeholder="Enter post title"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-900 dark:text-white">
                      Slug (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                      placeholder="auto-generated-if-empty"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-900 dark:text-white">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`border ${
                        formErrors.content
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-slate-600'
                      } rounded-lg overflow-hidden bg-white dark:bg-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-colors`}
                    >
                      <QuillWrapper
                        ref={quillRef}
                        value={formData.content}
                        onChange={(value) =>
                          setFormData({ ...formData, content: value })
                        }
                        modules={modules}
                        formats={formats}
                        className="min-h-[280px] [&_.ql-container]:min-h-[220px] [&_.ql-container]:text-gray-900 [&_.ql-container]:dark:text-white [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:dark:bg-slate-800"
                        placeholder="Write your post content here..."
                      />
                    </div>
                    {formErrors.content && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.content}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-medium mb-4 text-gray-900 dark:text-white">
                      Images
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => openCloudinaryWidget('image')}
                        disabled={uploadingImages}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 ${
                          uploadingImages
                            ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {uploadingImages ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImageIcon size={18} />
                            Upload Images
                          </>
                        )}
                      </button>
                    </div>

                    {mediaItems.filter(m => m.type === 'image').length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mediaItems.filter(m => m.type === 'image').map((img, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-300 dark:border-slate-600">
                            <img
                              src={img.url}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeMedia(idx)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                              {img.format?.toUpperCase() || 'IMAGE'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-medium mb-4 text-gray-900 dark:text-white">
                      Videos
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => openCloudinaryWidget('video')}
                        disabled={uploadingVideos}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 ${
                          uploadingVideos
                            ? 'bg-purple-100 text-purple-600 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {uploadingVideos ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Video size={18} />
                            Upload Videos
                          </>
                        )}
                      </button>
                    </div>

                    {mediaItems.filter(m => m.type === 'video').length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mediaItems.filter(m => m.type === 'video').map((video, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-300 dark:border-slate-600 bg-gray-900">
                            <video
                              src={video.url}
                              className="w-full h-32 object-cover"
                              controls
                            />
                            <button
                              type="button"
                              onClick={() => removeMedia(idx)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                              {video.format?.toUpperCase() || 'VIDEO'} {video.duration ? `• ${Math.floor(video.duration)}s` : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow transition-all duration-200 active:scale-[0.98]"
                      >
                        {editingPost ? 'Update Post' : 'Create Post'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

