
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBookOpen, FiSend, FiX, FiLock, FiLoader, FiAlertCircle,
  FiExternalLink, FiCalendar, FiTag, FiFileText, FiBarChart2,
  FiCheckCircle, FiEye, FiDownload, FiShare2, FiStar,
  FiUsers, FiClock, FiGlobe, FiShield, FiBookmark, 
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
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <motion.div
      className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl shadow-lg border ${colors[type]} flex items-start gap-3`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <div className={`mt-0.5 ${type === 'success' ? 'text-emerald-600' : type === 'error' ? 'text-rose-600' : 'text-blue-600'}`}>
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-10 border-b border-slate-100">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-white rounded-2xl shadow-md">
                    <FiBookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex gap-3">
                    <span className="px-5 py-2.5 bg-white text-blue-600 rounded-xl text-sm font-semibold shadow-sm border border-blue-100">
                      {resource.category}
                    </span>
                    <span className="px-5 py-2.5 bg-white text-emerald-600 rounded-xl text-sm font-semibold shadow-sm border border-emerald-100">
                      {resource.difficulty}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6 leading-tight">{resource.title}</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200">
                    <FiFileText className="w-5 h-5 text-blue-500" />
                    <span className="text-slate-700 font-medium">{resource.format}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200">
                    <FiCalendar className="w-5 h-5 text-purple-500" />
                    <span className="text-slate-600">Added {formatDate(resource.created_at || Date.now())}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200">
                    <FiStar className="w-5 h-5 text-amber-500" />
                    <span className="text-slate-600">Premium Resource</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-4 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
              >
                <FiX className="w-6 h-6 text-slate-500 hover:text-slate-700" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-10 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="mb-10">
                  <h3 className="text-xl font-semibold text-slate-800 mb-8 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <FiBarChart2 className="w-6 h-6 text-blue-600" />
                    </div>
                    Description
                  </h3>
                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-700 leading-relaxed text-lg">
                      {resource.description}
                    </p>
                  </div>
                </div>

                {resource.tags && resource.tags.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-xl font-semibold text-slate-800 mb-8 flex items-center gap-4">
                      <div className="p-3 bg-purple-50 rounded-xl">
                        <FiTag className="w-6 h-6 text-purple-600" />
                      </div>
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {resource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-6 py-3 bg-white text-slate-700 rounded-xl border border-slate-200 text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 shadow-lg">
                  <h3 className="text-xl font-semibold text-slate-800 mb-8 flex items-center gap-4">
                    <FiGlobe className="w-6 h-6 text-blue-600" />
                    Access Resource
                  </h3>
                  
                  {resource.restricted && !isLoggedIn ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-50 rounded-full mb-8 border border-amber-200 shadow-md">
                        <FiLock className="w-12 h-12 text-amber-600" />
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                        This resource is exclusively available to registered members of our community.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex items-center justify-center gap-4 group"
                      >
                        <FiExternalLink className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        Open Resource
                        <span className="text-sm opacity-90 ml-2">(External Link)</span>
                      </a>
                      
                      <div className="space-y-4">
                        <button className="w-full py-4 px-6 bg-white text-slate-700 font-medium rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200 shadow-sm flex items-center justify-center gap-4 hover:-translate-y-1">
                          <FiDownload className="w-5 h-5" />
                          Download PDF
                        </button>
                        
                        <button className="w-full py-4 px-6 bg-white text-slate-700 font-medium rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200 shadow-sm flex items-center justify-center gap-4 hover:-translate-y-1">
                          <FiBookmark className="w-5 h-5" />
                          Save for Later
                        </button>
                        
                        <button className="w-full py-4 px-6 bg-white text-slate-700 font-medium rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200 shadow-sm flex items-center justify-center gap-4 hover:-translate-y-1">
                          <FiShare2 className="w-5 h-5" />
                          Share Resource
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
                  <h3 className="text-xl font-semibold text-slate-800 mb-8 flex items-center gap-4">
                    <FiShield className="w-6 h-6 text-emerald-600" />
                    Quick Information
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                      <span className="text-slate-600">Format Type</span>
                      <span className="font-semibold text-slate-800">{resource.format}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                      <span className="text-slate-600">Difficulty Level</span>
                      <span className={`font-bold ${
                        resource.difficulty === 'Beginner' ? 'text-emerald-600' :
                        resource.difficulty === 'Intermediate' ? 'text-amber-600' :
                        'text-rose-600'
                      }`}>
                        {resource.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                      <span className="text-slate-600">Approval Status</span>
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                        ✓ Verified
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-4">
                      <span className="text-slate-600">Access Control</span>
                      <span className={`font-semibold px-4 py-2 rounded-lg ${
                        resource.restricted 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
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

      showNotification('success', 'Submitted Successfully!', 'Your resource has been submitted for admin review.');
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
      showNotification('error', 'Submission Failed', err?.response?.data?.detail || 'Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const visibleResources = getVisibleResources(resources);

  // Format difficulty color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Advanced': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Programming': 'bg-blue-50 text-blue-600 border-blue-200',
      'Web Development': 'bg-purple-50 text-purple-600 border-purple-200',
      'Data Science': 'bg-emerald-50 text-emerald-600 border-emerald-200',
      'Machine Learning': 'bg-amber-50 text-amber-600 border-amber-200',
      'DevOps': 'bg-rose-50 text-rose-600 border-rose-200',
      'Mobile Development': 'bg-violet-50 text-violet-600 border-violet-200',
      'Design': 'bg-cyan-50 text-cyan-600 border-cyan-200',
      'Other': 'bg-slate-50 text-slate-600 border-slate-200'
    };
    return colors[category] || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <section className="relative min-h-screen py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50" />
      
      <div className="container relative mx-auto px-5 max-w-7xl">
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-10 border border-slate-200 shadow-sm">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <FiBookOpen className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-blue-700 mb-1">RESOURCE LIBRARY</div>
                <div className="text-xs text-slate-500">Curated knowledge for developers & professionals</div>
              </div>
              <div className="h-8 w-px bg-slate-300 mx-4" />
              <div className="flex items-center gap-3">
                <FiUsers className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-slate-700">{visibleResources.length} resources</span>
              </div>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-8 leading-tight">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r text">Premium</span><br />
              Learning Resources
            </h2>
            
            <p className="text-xl text-slate-600 max-w-3xl leading-relaxed mb-12">
              Access our curated collection of high-quality learning materials, tutorials, 
              and professional references. Each resource is vetted for quality and relevance.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Resources', value: visibleResources.length, icon: FiBookOpen, color: 'from-blue-50 to-indigo-50' },
                { label: 'Beginner Friendly', value: visibleResources.filter(r => r.difficulty === 'Beginner').length, icon: FiStar, color: 'from-emerald-50 to-teal-50' },
                { label: 'PDF Documents', value: visibleResources.filter(r => r.format === 'PDF').length, icon: FiFileText, color: 'from-amber-50 to-orange-50' },
                { label: 'Public Access', value: visibleResources.filter(r => !r.restricted).length, icon: FiGlobe, color: 'from-purple-50 to-pink-50' }
              ].map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="relative p-6 bg-white backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-gradient-to-br bg-slate-50 rounded-xl border border-slate-200">
                        <stat.icon className="w-6 h-6 text-slate-700" />
                      </div>
                      <div className="text-4xl font-bold text-slate-800">{stat.value}</div>
                    </div>
                    <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={() => setShowSubmitModal(true)}
            className="group px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex items-center gap-6 border border-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-4 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform">
              <FiSend className="w-8 h-8" />
            </div>
            <div className="text-left">
              <div className="text-xl mb-2">Contribute Resource</div>
              <div className="text-sm text-blue-100 font-normal">Share your knowledge with community</div>
            </div>
          </motion.button>
        </div>

        {/* Loading / Error / Empty / Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-[500px]">
            <div className="relative">
              <div className="w-28 h-28 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-28 h-28 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-10 text-xl text-slate-600">Loading resources...</p>
            <p className="text-sm text-slate-500 mt-3">Please wait while we fetch the content</p>
          </div>
        ) : error ? (
          <div className="text-center py-28">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-rose-50 rounded-full mb-10 border border-rose-200 shadow-lg">
              <FiAlertCircle className="w-14 h-14 text-rose-600" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-6">Connection Error</h3>
            <p className="text-xl text-slate-600 mb-10 max-w-lg mx-auto">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-5 bg-white text-slate-700 font-semibold rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-300 shadow-sm flex items-center gap-3 hover:-translate-y-1"
            >
              <FiLoader className="w-5 h-5 animate-spin" />
              Try Again
            </button>
          </div>
        ) : visibleResources.length === 0 ? (
          <div className="text-center py-28 bg-white rounded-3xl border border-slate-200 shadow-xl">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-blue-50 rounded-full mb-10 border border-blue-200 shadow-lg">
              <FiBookOpen className="w-14 h-14 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-6">No Resources Available</h3>
            <p className="text-slate-600 text-xl mb-12 max-w-xl mx-auto leading-relaxed">
              Be the first to contribute to our learning community by submitting a premium resource!
              Share your knowledge and help others grow.
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5"
            >
              Submit First Resource
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleResources.map((resource) => (
              <motion.div
                key={resource.id}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-200 overflow-hidden group-hover:border-blue-300"
                  whileHover={{ y: -12, transition: { duration: 0.3 } }}
                >
                  {/* Card header */}
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <span className={`px-5 py-2.5 ${getCategoryColor(resource.category)} rounded-xl text-sm font-semibold shadow-sm border`}>
                        {resource.category}
                      </span>
                      <span className={`px-5 py-2.5 ${getDifficultyColor(resource.difficulty)} rounded-xl text-sm font-semibold shadow-sm border`}>
                        {resource.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {resource.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-base mb-10 line-clamp-3 leading-relaxed">
                      {resource.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                          <FiFileText className="w-5 h-5 text-blue-500" />
                          <span className="text-sm text-slate-700 font-medium">{resource.format}</span>
                        </div>
                        {resource.restricted && (
                          <div className="flex items-center gap-3 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-200">
                            <FiLock className="w-5 h-5 text-amber-600" />
                            <span className="text-sm text-amber-700 font-medium">Premium</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <FiClock className="w-5 h-5" />
                        <span className="text-sm">~5 min</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedResource(resource)}
                        className="flex-1 py-4 px-6 bg-slate-50 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-300 border border-slate-300 hover:shadow-md flex items-center justify-center gap-3"
                      >
                        <FiEye className="w-5 h-5" />
                        View Details
                      </button>
                      
                      {resource.restricted && !isLoggedIn ? (
                        <button
                          disabled
                          className="py-4 px-6 bg-amber-50 text-amber-700 font-semibold rounded-xl cursor-not-allowed flex items-center gap-3 border border-amber-300"
                        >
                          <FiLock className="w-5 h-5" />
                          Locked
                        </button>
                      ) : (
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-3 group"
                        >
                          <FiExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          Open
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Card footer gradient */}
                  <div className="h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
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
            className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-10 border-b border-slate-200">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-4">Submit New Resource</h3>
                    <p className="text-slate-600">Share valuable learning materials with our community</p>
                  </div>
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="p-4 hover:bg-white/80 rounded-xl transition-colors border border-slate-300"
                  >
                    <FiX className="w-6 h-6 text-slate-500 hover:text-slate-700" />
                  </button>
                </div>
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-blue-200 shadow-sm">
                  <FiStar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-blue-700">All submissions are reviewed by our team</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-4">
                      Resource Title <span className="text-rose-600">*</span>
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full p-5 bg-white border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${formErrors.title ? 'border-rose-500' : 'border-slate-300'
                        } text-slate-800 placeholder:text-slate-400 shadow-sm`}
                      placeholder="e.g., Complete Python Programming Guide"
                    />
                    {formErrors.title && (
                      <p className="text-rose-600 text-sm mt-3 flex items-center gap-2">
                        <FiAlertCircle className="w-4 h-4" />
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-4">
                      Category <span className="text-rose-600">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full p-5 bg-white border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${formErrors.category ? 'border-rose-500' : 'border-slate-300'
                        } text-slate-800 shadow-sm`}
                    >
                      <option value="" className="text-slate-400">Select Category</option>
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
                      <p className="text-rose-600 text-sm mt-3 flex items-center gap-2">
                        <FiAlertCircle className="w-4 h-4" />
                        {formErrors.category}
                      </p>
                    )}
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-4">Format</label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleInputChange}
                      className="w-full p-5 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 shadow-sm"
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
                    <label className="block text-sm font-semibold text-slate-700 mb-4">Difficulty Level</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full p-5 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 shadow-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-4">
                      Tags (comma separated)
                    </label>
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full p-5 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 placeholder:text-slate-400 shadow-sm"
                      placeholder="python, tutorial, beginner, algorithms"
                    />
                  </div>

                  {/* Link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-4">
                      Resource URL <span className="text-rose-600">*</span>
                    </label>
                    <input
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className={`w-full p-5 bg-white border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${formErrors.link ? 'border-rose-500' : 'border-slate-300'
                        } text-slate-800 placeholder:text-slate-400 shadow-sm`}
                      placeholder="https://example.com/resource"
                    />
                    {formErrors.link && (
                      <p className="text-rose-600 text-sm mt-3 flex items-center gap-2">
                        <FiAlertCircle className="w-4 h-4" />
                        {formErrors.link}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-4">
                      Description <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full p-5 bg-white border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${formErrors.description ? 'border-rose-500' : 'border-slate-300'
                        } text-slate-800 placeholder:text-slate-400 shadow-sm resize-none`}
                      placeholder="Provide a detailed description of the resource, what learners can expect, and why it's valuable..."
                    />
                    {formErrors.description && (
                      <p className="text-rose-600 text-sm mt-3 flex items-center gap-2">
                        <FiAlertCircle className="w-4 h-4" />
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  {/* Restricted Checkbox */}
                  <div className="md:col-span-2">
                    <label className="flex items-start gap-5 cursor-pointer select-none p-6 bg-slate-50 rounded-2xl border border-slate-300 hover:border-blue-400 transition-all duration-300">
                      <input
                        type="checkbox"
                        name="restricted"
                        checked={formData.restricted}
                        onChange={handleInputChange}
                        className="w-6 h-6 rounded border-slate-400 bg-white text-blue-600 focus:ring-blue-500 mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-4 mb-3">
                          <FiLock className="w-6 h-6 text-amber-600" />
                          <span className="font-semibold text-slate-800 text-lg">Restricted Access</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Enable this option to make this resource available only to registered members.
                          Premium resources receive higher visibility and are featured prominently.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-6 pt-10 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-5 px-8 bg-white text-slate-700 font-semibold rounded-2xl hover:shadow-lg transition-all duration-300 border border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 py-5 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-500 flex items-center justify-center gap-4 ${submitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]'
                      }`}
                  >
                    {submitting ? (
                      <>
                        <div className="relative">
                          <div className="w-6 h-6 border-2 border-white/30 rounded-full"></div>
                          <div className="absolute top-0 left-0 w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="w-6 h-6" />
                        <span>Submit for Review</span>
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