
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FiGithub, FiExternalLink, FiCode, FiBookOpen,
  FiX, FiUsers, FiCalendar, FiGlobe, FiVideo,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { getProjects } from '../../../api';

const ProjectCard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const hoverCard = {
    y: -10,
    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
    transition: { type: "spring", stiffness: 300, damping: 15 }
  };

  const hoverImage = {
    scale: 1.05,
    transition: { duration: 0.3 }
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
  setCurrentImageIndex(0);
}, [selectedProject]);
  // Fetch projects → only approved ones
  // Fetch projects → only approved ones
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        const allProjects = response.data || [];

        // Normalize approval_status to lowercase for consistent filtering
        const normalizedProjects = allProjects.map(project => ({
          ...project,
          approval_status: project.approval_status.toLowerCase()  // ← Add this normalization
        }));

        const approvedProjects = normalizedProjects.filter(
          project => project.approval_status === 'approved'
        );

        setProjects(approvedProjects);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="text-4xl font-bold text-gray-900 mb-4">Project Gallery</div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="text-4xl font-bold text-gray-900 mb-4">Project Gallery</div>
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Safe HTML rendering for description
  const renderDescription = (desc) => {
    return { __html: desc || '<p>No description provided.</p>' };
  };

  

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Project Gallery
            </span>
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6 rounded-full"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {projects.length > 0
              ? `Discover ${projects.length} innovative projects built by our community`
              : 'No approved projects to show yet. Submit yours today!'}
          </motion.p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-xl text-gray-500 mb-6">
              No approved projects available at the moment.
            </div>
            <a
              href="/submit-project"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Submit Your Project
              <FiExternalLink className="ml-2" />
            </a>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id || index}
                className="group cursor-pointer h-[550px]" // Fixed height for all cards
                variants={item}
                whileHover={hoverCard}
                onClick={() => setSelectedProject(project)}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full flex flex-col transition-all duration-300">
                  {/* Cover Image - uses first image from images array */}
                  <div className="relative h-64 overflow-hidden flex-shrink-0">
                    <motion.div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${project.images?.[0] || '/images/default-project.jpg'})`,
                        backgroundColor: project.images?.[0] ? 'transparent' : '#f3f4f6'
                      }}
                      initial={{ scale: 1.08 }}
                      whileHover={hoverImage}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${project.status?.toLowerCase() === 'completed'
                          ? 'bg-green-500/90 text-white'
                          : 'bg-blue-500/90 text-white'
                        }`}>
                        {project.status || 'Ongoing'}
                      </span>
                      {project.year && (
                        <span className="px-3 py-1 bg-gray-800/80 text-white rounded-full text-xs font-bold shadow-sm">
                          {project.year}
                        </span>
                      )}
                    </div>

                    {project.domain && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-indigo-600/90 text-white rounded-full text-xs font-bold shadow-sm">
                        {project.domain}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col min-h-0">
                    <motion.h3
                      className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors flex-shrink-0"
                      whileHover={{ x: 4 }}
                    >
                      {project.title}
                    </motion.h3>

                    {/* Scrollable content area (description + tech stack) */}
                    <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                      <p className="text-gray-600">
                        {project.description?.replace(/<[^>]*>/g, '') || 'No description provided.'}
                      </p>

                      {project.tech_stack?.length > 0 && (
                        <div>
                          <div className="flex items-center text-gray-700 mb-2 text-sm font-medium">
                            <FiCode className="mr-2 text-blue-500 flex-shrink-0" />
                            Tech Stack
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.tech_stack.map((tech, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer (always visible) */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto flex-shrink-0">
                      <div className="flex gap-3">
                        {project.github && (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            whileHover={{ scale: 1.1, y: -2 }}
                            onClick={e => e.stopPropagation()}
                          >
                            <FiGithub className="text-gray-700 w-5 h-5" />
                          </motion.a>
                        )}
                        {/* Use demo_link instead of demo */}
                        {project.demo_link && (
                          <motion.a
                            href={project.demo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            whileHover={{ scale: 1.1, y: -2 }}
                            onClick={e => e.stopPropagation()}
                          >
                            <FiExternalLink className="text-gray-700 w-5 h-5" />
                          </motion.a>
                        )}
                      </div>

                      <div className="text-blue-600 font-medium flex items-center gap-1.5 group-hover:text-blue-700 transition-colors">
                        View Details
                        <FiBookOpen className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Call to action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="/submit-project"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:-translate-y-1"
          >
            Submit Your Project
            <FiExternalLink className="ml-2 w-5 h-5" />
          </a>
        </motion.div>
      </div>

      {/* ────────────────────────────────────────────────
           MODAL - Integrated directly in the same component
      ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setSelectedProject(null)}
    />

    <motion.div
      initial={{ scale: 0.85, y: 60, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.85, y: 60, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10"
    >
      {/* Image Slider Header */}
      <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl group">
        {/* Current Image */}
        <motion.img
          key={currentImageIndex} // triggers animation on index change
          src={selectedProject.images?.[currentImageIndex] || '/images/default-project.jpg'}
          alt={`${selectedProject.title} - image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => setSelectedProject(null)}
          className="absolute top-4 right-4 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors z-20"
        >
          <FiX size={24} />
        </button>

        {/* Image Navigation Arrows (only if multiple images) */}
        {selectedProject.images?.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) =>
                  prev === 0 ? selectedProject.images.length - 1 : prev - 1
                );
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) =>
                  prev === selectedProject.images.length - 1 ? 0 : prev + 1
                );
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Indicators (dots) */}
        {selectedProject.images?.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {selectedProject.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentImageIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute bottom-6 left-6 flex flex-wrap gap-3 z-20">
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
            selectedProject.status?.toLowerCase() === 'completed'
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white'
          }`}>
            {selectedProject.status || 'Ongoing'}
          </span>

          {selectedProject.domain && (
            <span className="px-4 py-1.5 bg-indigo-600/90 text-white rounded-full text-sm font-semibold">
              {selectedProject.domain}
            </span>
          )}

          {selectedProject.year && (
            <span className="px-4 py-1.5 bg-gray-800/80 text-white rounded-full text-sm font-semibold flex items-center gap-1.5">
              <FiCalendar size={14} />
              {selectedProject.year}
            </span>
          )}
        </div>
      </div>

      {/* Rest of the content (unchanged) */}
      <div className="p-6 md:p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {selectedProject.title}
        </h2>

        <div className="flex flex-wrap gap-6 mb-8 text-gray-600">
          {selectedProject.team?.length > 0 && (
            <div className="flex items-center gap-2">
              <FiUsers className="text-blue-600" size={18} />
              <span>Team: {selectedProject.team.join(', ')}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <FiGlobe className="text-indigo-600" size={18} />
            <span>Student ID: {selectedProject.student_id || '—'}</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-10">
          <div dangerouslySetInnerHTML={{ __html: selectedProject.description }} />
        </div>

        {selectedProject.tech_stack?.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCode className="text-blue-600" />
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tech_stack.map((tech, index) => (
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

        <div className="flex flex-wrap gap-4">
          {selectedProject.github && (
            <a
              href={selectedProject.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <FiGithub size={20} />
              View GitHub
            </a>
          )}

          {selectedProject.demo_link && (
            <a
              href={selectedProject.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiVideo size={20} />
              Watch Demo
            </a>
          )}

          {!selectedProject.github && !selectedProject.demo_link && (
            <p className="text-gray-500 italic">No external links available</p>
          )}
        </div>
      </div>
    </motion.div>
  </motion.div>
)}
      </AnimatePresence>
    </section>
  );
};

export default ProjectCard;