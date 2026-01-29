import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const EventFilters = ({ setView, currentView, onApply }) => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual filter items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm p-4 lg:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Event Type Filter */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
          <select className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Types</option>
            <option>Hackathon</option>
            <option>Workshop</option>
            <option>Datathon</option>
            <option>Symposium</option>
          </select>
        </motion.div>
        
        {/* Date Filter */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <select className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Upcoming</option>
            <option>Past</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </motion.div>
        
        {/* Category Filter */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Tech</option>
            <option>Career</option>
            <option>Academic</option>
            <option>Social</option>
          </select>
        </motion.div>
        
        {/* Search Input */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>
      </div>
      
      {/* View Toggle and Apply Button */}
      <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <motion.button
            onClick={() => setView('grid')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              currentView === 'grid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Grid View
          </motion.button>
          <motion.button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              currentView === 'calendar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Calendar View
          </motion.button>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
          <motion.button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onApply}
          >
            Apply Filters
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

EventFilters.propTypes = {
  setView: PropTypes.func.isRequired,
  currentView: PropTypes.string.isRequired,
  onApply: PropTypes.func,
};

export default EventFilters;