import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiUser, FiCode,  FiBookOpen, FiGitBranch, FiGlobe, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
import { createProject } from '../../../api';

const SubmissionForm = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    team: '',
    github: '',
    demo: '',
    domain: '',
    status: 'ongoing'
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('You must be logged in to submit a project.');
    }

    // Transform data if needed
    const projectData = {
      ...formData,
      // Ensure techStack is a string if your backend expects it
      techStack: Array.isArray(formData.techStack) 
        ? formData.techStack.join(', ') 
        : formData.techStack,
      // Ensure team is a string if your backend expects it
      team: Array.isArray(formData.team) 
        ? formData.team.join(', ') 
        : formData.team,
    };

    const response = await createProject(projectData);
    
    console.log('Project submitted successfully:', response.data);
    setIsSubmitting(false);
    
    // Call success callback if provided
    // eslint-disable-next-line no-undef
    if (onSuccess) {
      // eslint-disable-next-line no-undef
      onSuccess();
    }
    
    onClose();
  } catch (err) {
    console.error('Error submitting project:', err);
    setError(err.response?.data?.message || err.message || 'Failed to submit project. Please try again.');
    setIsSubmitting(false);
  }
};

  const domains = ['AI/ML', 'Web Development', 'Mobile Apps', 'IoT', 'chain', 'Data Science', 'Cybersecurity', 'Cloud Computing'];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-60"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto z-10 overflow-hidden"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Form header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 p-1"
            >
              <FiX size={24} />
            </button>
            
            <h3 className="text-2xl font-bold text-white mb-1">
              Submit Your Project
            </h3>
            <p className="text-blue-100">Share your innovation with the CLUSTER community</p>
          </div>
          
          {/* Form body */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className=" text-gray-700 mb-2 font-medium flex items-center">
                  <FiBookOpen className="mr-2 text-blue-500" />
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter project title"
                  required
                />
              </div>
              
              <div>
                <label className=" text-gray-700 mb-2 font-medium flex items-center">
                  <FiBookOpen className="mr-2 text-blue-500" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Describe your project in detail"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className=" text-gray-700 mb-2 font-medium flex items-center">
                    <FiCode className="mr-2 text-blue-500" />
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="React, Node.js, MongoDB"
                    required
                  />
                </div>
                
                <div>
                  <label className=" text-gray-700 mb-2 font-medium flex items-center">
                    <FiUser className="mr-2 text-blue-500" />
                    Team Members
                  </label>
                  <input
                    type="text"
                    name="team"
                    value={formData.team}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Names separated by commas"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className=" text-gray-700 mb-2 font-medium">
                    Project Domain
                  </label>
                  <div className="relative">
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer pr-10"
                      required
                    >
                      <option value="">Select a domain</option>
                      {domains.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <FiChevronDown className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className=" text-gray-700 mb-2 font-medium">
                    Project Status
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="ongoing"
                        checked={formData.status === 'ongoing'}
                        onChange={handleChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">Ongoing</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="completed"
                        checked={formData.status === 'completed'}
                        onChange={handleChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">Completed</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className=" text-gray-700 mb-2 font-medium flex items-center">
                    <FiGitBranch className="mr-2 text-blue-500" />
                    GitHub Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="https://github.com/..."
                  />
                </div>
                
                <div>
                  <label className=" text-gray-700 mb-2 font-medium flex items-center">
                    <FiGlobe className="mr-2 text-blue-500" />
                    Demo Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="demo"
                    value={formData.demo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="https://demo..."
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <motion.button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Submit Project
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
SubmissionForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SubmissionForm;