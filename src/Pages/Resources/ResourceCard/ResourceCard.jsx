import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBookOpen, FiSend, FiX, FiLock, FiLoader, FiAlertCircle,
  FiExternalLink, FiCalendar, FiTag, FiFileText, FiBarChart2,
  FiCheckCircle, FiEye, FiDownload, FiShare2
} from 'react-icons/fi';
import PropTypes from 'prop-types';

// API
import { getResources, createResource } from '../../../api';

// Utils
import { getVisibleResources } from '../../../utils/resourceUtils';

// ────────────────────────────────────────────────
// Custom Notification Component
// ────────────────────────────────────────────────
const Notification = ({ type, title, message, onClose }) => {
  const icons = {
    success: <FiCheckCircle className="w-5 h-5" />,
    error: <FiAlertCircle className="w-5 h-5" />,
    info: <FiAlertCircle className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <motion.div
      className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl shadow-lg border ${colors[type]} flex items-start gap-3`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <div className={`mt-0.5 ${type === 'success' ? 'text-emerald-600' : type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm mt-1 opacity-90">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 ml-2"
      >
        <FiX size={18} />
      </button>
    </motion.div>
  );
};

// ────────────────────────────────────────────────
// Resource Details Modal
// ────────────────────────────────────────────────
const ResourceDetailsModal = ({ resource, isOpen, onClose, isLoggedIn }) => {
  if (!isOpen || !resource) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-100"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <FiBookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <span className="inline-block px-4 py-1.5 bg-white text-blue-600 rounded-full text-sm font-medium shadow-sm">
                      {resource.category}
                    </span>
                    <span className="ml-3 inline-block px-4 py-1.5 bg-white text-indigo-600 rounded-full text-sm font-medium shadow-sm">
                      {resource.difficulty}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">{resource.title}</h2>
                <div className="flex items-center gap-6 text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiFileText className="w-4 h-4" />
                    <span className="font-medium">{resource.format}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>Added {new Date(resource.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/80 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FiBarChart2 className="w-5 h-5 text-blue-500" />
                    Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                    {resource.description}
                  </p>
                </div>

                {resource.tags && resource.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <FiTag className="w-5 h-5 text-blue-500" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white text-slate-700 rounded-full border border-slate-200 text-sm font-medium shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Access Resource</h3>
                  
                  {resource.restricted && !isLoggedIn ? (
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-sm">
                        <FiLock className="w-8 h-8 text-amber-500" />
                      </div>
                      <p className="text-amber-600 font-medium mb-4">Login required to access</p>
                      <p className="text-slate-600 text-sm">This resource is restricted to registered members only.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                      >
                        <FiExternalLink className="w-5 h-5" />
                        Open Resource
                      </a>
                      
                      <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                          <FiDownload className="w-4 h-4" />
                          Download PDF
                        </button>
                        
                        <button className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                          <FiShare2 className="w-4 h-4" />
                          Share Resource
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Format</span>
                      <span className="font-semibold text-slate-800">{resource.format}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Difficulty</span>
                      <span className="font-semibold text-slate-800">{resource.difficulty}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Status</span>
                      <span className="font-semibold text-emerald-600">Approved</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Access</span>
                      <span className={`font-semibold ${resource.restricted ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {resource.restricted ? 'Restricted' : 'Public'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ────────────────────────────────────────────────
// Resource Card Component
// ────────────────────────────────────────────────
const ResourceCard = ({ isLoggedIn }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [notification, setNotification] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    format: 'PDF',
    difficulty: 'Beginner',
    link: '',
    restricted: false,
    description: '',
    tags: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch resources
  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getResources();
        if (!isMounted) return;
        const visible = getVisibleResources(data);
        setResources(visible);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        if (isMounted) {
          setError('Unable to load resources. Please try again later.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResources();
    return () => { isMounted = false; };
  }, []);

  const showNotification = (type, title, message, duration = 4000) => {
    setNotification({ type, title, message });
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.link.trim()) {
      errors.link = 'Link is required';
    } else if (!formData.link.startsWith('http://') && !formData.link.startsWith('https://')) {
      errors.link = 'Link must start with http:// or https://';
    }
    if (!formData.description.trim()) errors.description = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      await createResource({
        ...formData,
        approval_status: 'pending',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      });

      showNotification('success', 'Submitted!', 'Your resource has been submitted for admin review.');
      setShowSubmitModal(false);
      setFormData({
        title: '',
        category: '',
        format: 'PDF',
        difficulty: 'Beginner',
        link: '',
        restricted: false,
        description: '',
        tags: ''
      });
    } catch (err) {
      console.error('Resource submission failed:', err);
      showNotification('error', 'Submission failed', err?.response?.data?.detail || 'Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const visibleResources = getVisibleResources(resources);

  // Format difficulty color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-emerald-100 text-emerald-700';
      case 'Intermediate': return 'bg-amber-100 text-amber-700';
      case 'Advanced': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-5 max-w-7xl">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <Notification
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <FiBookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Resource Library</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
              Discover Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Resources</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Curated collection of high-quality learning materials, tutorials, and references for developers and tech enthusiasts.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 whitespace-nowrap"
          >
            <FiSend className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Submit Resource
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-3xl font-bold text-slate-800 mb-2">{visibleResources.length}</div>
            <div className="text-slate-600">Total Resources</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {visibleResources.filter(r => r.difficulty === 'Beginner').length}
            </div>
            <div className="text-slate-600">Beginner Friendly</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {visibleResources.filter(r => r.format === 'PDF').length}
            </div>
            <div className="text-slate-600">PDF Documents</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {visibleResources.filter(r => !r.restricted).length}
            </div>
            <div className="text-slate-600">Public Access</div>
          </div>
        </div>

        {/* Loading / Error / Empty / Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-lg text-slate-600">Loading resources...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
              <FiAlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <p className="text-xl text-slate-800 mb-3">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : visibleResources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
              <FiBookOpen className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">No resources yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Be the first to contribute to our learning community by submitting a resource!
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Submit First Resource
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleResources.map((resource) => (
              <motion.div
                key={resource.id}
                className="bg-white rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group"
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                      {resource.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-slate-500">
                      <FiFileText className="w-4 h-4" />
                      <span className="text-sm">{resource.format}</span>
                    </div>
                    {resource.restricted && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <FiLock className="w-4 h-4" />
                        <span className="text-sm font-medium">Restricted</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedResource(resource)}
                      className="flex-1 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <FiEye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    {resource.restricted && !isLoggedIn ? (
                      <button
                        disabled
                        className="py-3 px-4 bg-amber-50 text-amber-600 font-medium rounded-xl cursor-not-allowed flex items-center gap-2"
                      >
                        <FiLock className="w-4 h-4" />
                        Locked
                      </button>
                    ) : (
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        Open
                      </a>
                    )}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Resource Details Modal ──────────────────────────────────────── */}
      <ResourceDetailsModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        isLoggedIn={isLoggedIn}
      />

      {/* ─── Submit Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Submit New Resource</h3>
                    <p className="text-slate-600">Share valuable learning materials with the community</p>
                  </div>
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="p-2 hover:bg-white/80 rounded-lg transition-colors"
                  >
                    <FiX className="w-6 h-6 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Resource Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${formErrors.title ? 'border-red-500' : 'border-slate-200'
                        } bg-white text-slate-800`}
                      placeholder="e.g., Complete Python Programming Guide"
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm mt-2">{formErrors.title}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${formErrors.category ? 'border-red-500' : 'border-slate-200'
                        } bg-white text-slate-800`}
                    >
                      <option value="">Select Category</option>
                      <option value="Programming">Programming</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Design">Design</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.category && (
                      <p className="text-red-500 text-sm mt-2">{formErrors.category}</p>
                    )}
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="Video">Video Tutorial</option>
                      <option value="Article">Article/Blog Post</option>
                      <option value="Course">Online Course</option>
                      <option value="Cheatsheet">Cheatsheet</option>
                      <option value="Tool">Tool/Software</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                      placeholder="e.g., python, tutorial, beginner"
                    />
                  </div>

                  {/* Link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Resource URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${formErrors.link ? 'border-red-500' : 'border-slate-200'
                        } bg-white text-slate-800`}
                      placeholder="https://example.com/resource"
                    />
                    {formErrors.link && (
                      <p className="text-red-500 text-sm mt-2">{formErrors.link}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${formErrors.description ? 'border-red-500' : 'border-slate-200'
                        } bg-white text-slate-800`}
                      placeholder="Provide a brief description of the resource and what learners can expect..."
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-2">{formErrors.description}</p>
                    )}
                  </div>

                  {/* Restricted Checkbox */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer select-none p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        name="restricted"
                        checked={formData.restricted}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-medium text-slate-700">Restricted Access</span>
                        <p className="text-sm text-slate-500 mt-1">
                          Only logged-in users will be able to access this resource
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-4 px-6 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 ${submitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-xl hover:-translate-y-0.5'
                      }`}
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiSend />
                        Submit for Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

ResourceCard.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default ResourceCard;