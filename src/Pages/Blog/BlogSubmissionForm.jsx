
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiX, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { createBlog } from "../../api";

const BlogSubmissionForm = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    image: '',
    restricted: false
  });
  const [error, setError] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    
    // Auto-hide success notifications after 4 seconds
    if (type === 'success') {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 4000);
    }
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    hideNotification();

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        author: formData.author.trim(),
        date: formData.date,
        excerpt: formData.excerpt.trim(),
        image: formData.image.trim() || null,
        restricted: formData.restricted
      };

      await createBlog(payload);

      showNotification(
        'success',
        'Your blog post has been submitted and is pending review.'
      );

      onSuccess?.();
      
      // Close form after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.log(err)
      const msg = err.response?.data?.detail || err.message || 'Submission failed';
      setError(msg);
      showNotification('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Notification Banner */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className="fixed top-4 right-4 z-[60] max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <div className={`p-4 rounded-lg shadow-lg flex items-start gap-3 ${
              notification.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className={`mt-0.5 ${
                notification.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {notification.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {notification.type === 'success' ? 'Submitted!' : 'Error'}
                </p>
                <p className={`text-sm mt-1 ${
                  notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={hideNotification}
                className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
                }`}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                <FiX size={24} />
              </button>
              <h3 className="text-2xl font-bold text-white mb-1">
                Submit a Blog Post
              </h3>
              <p className="text-blue-100 text-sm">
                Share your knowledge with the CLUSTER community
              </p>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter blog title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    placeholder="e.g. Tutorial, Research, Event"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    placeholder="AI, Python, Machine Learning"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    placeholder="Your name or pen name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt / Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors resize-none"
                    placeholder="Short description of the blog post..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="restricted"
                    name="restricted"
                    checked={formData.restricted}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="restricted" className="text-sm text-gray-700 cursor-pointer select-none">
                    Restricted (login required to read)
                  </label>
                </div>

                <div className="pt-4">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Submitting...
                      </div>
                    ) : (
                      <>
                        <FiSend className="mr-2" />
                        Submit Blog Post
                      </>
                    )}
                  </motion.button>
                </div>

                {error && !notification.show && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default BlogSubmissionForm;