import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGithub, FiExternalLink, FiCode, FiUsers, FiCalendar, FiGlobe, FiVideo } from 'react-icons/fi';
import PropTypes from 'prop-types';

const ProjectDetailsModal = ({ project, onClose }) => {
  if (!project) return null;

  // Format description (HTML from Quill → safe rendering)
  const renderDescription = () => {
    return { __html: project.description || '<p>No description available.</p>' };
  };

  // Animation variants
  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modal = {
    hidden: { scale: 0.85, y: 50, opacity: 0 },
    visible: { 
      scale: 1, 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdrop}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal content */}
        <motion.div
          variants={modal}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10"
        >
          {/* Header with cover image */}
          <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
            <img
              src={project.image || '/images/default-project.jpg'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors z-10"
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>

            {/* Quick badges */}
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                project.status?.toLowerCase() === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white'
              }`}>
                {project.status || 'Ongoing'}
              </span>
              
              {project.domain && (
                <span className="px-4 py-1.5 bg-indigo-600/90 text-white rounded-full text-sm font-semibold">
                  {project.domain}
                </span>
              )}

              {project.year && (
                <span className="px-4 py-1.5 bg-gray-800/80 text-white rounded-full text-sm font-semibold flex items-center gap-1.5">
                  <FiCalendar size={14} />
                  {project.year}
                </span>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 md:p-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {project.title}
            </h2>

            {/* Meta info */}
            <div className="flex flex-wrap gap-6 mb-8 text-gray-600">
              {project.team?.length > 0 && (
                <div className="flex items-center gap-2">
                  <FiUsers className="text-blue-600" size={18} />
                  <span>Team: {project.team.join(', ')}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <FiGlobe className="text-indigo-600" size={18} />
                <span>Student ID: {project.student_id || '—'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none mb-10">
              <div dangerouslySetInnerHTML={renderDescription()} />
            </div>

            {/* Tech Stack */}
            {project.tech_stack?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiCode className="text-blue-600" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <FiGithub size={20} />
                  View GitHub
                </a>
              )}

              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FiVideo size={20} />
                  Watch Demo
                </a>
              )}

              {!project.github && !project.demo && (
                <p className="text-gray-500 italic">No external links available</p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

ProjectDetailsModal.propTypes = {
  project: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ProjectDetailsModal;