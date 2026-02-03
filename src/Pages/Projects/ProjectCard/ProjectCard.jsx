// import { motion } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import { FiGithub, FiExternalLink, FiCode, FiBookOpen } from 'react-icons/fi';
// import ProjectDetailsModal from '../ProjectDetailsModal/ProjectDetailsModal';
// import { getProjects } from '../../../api';


// const ProjectCard = () => {
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Animation variants (keep as is)
//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2
//       }
//     }
//   };

//   const item = {
//     hidden: { opacity: 0, y: 30 },
//     show: { 
//       opacity: 1, 
//       y: 0, 
//       transition: { 
//         duration: 0.6, 
//         ease: [0.16, 1, 0.3, 1] 
//       } 
//     }
//   };

//   const hoverCard = {
//     y: -10,
//     boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
//     transition: { 
//       type: "spring",
//       stiffness: 300,
//       damping: 15
//     }
//   };

//   const hoverImage = {
//     scale: 1.05,
//     transition: { 
//       duration: 0.3 
//     }
//   };

//   // Fetch projects from backend
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         const response = await getProjects();
//         // Assuming your API returns data in response.data
//         setProjects(response.data || []);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching projects:', err);
//         setError('Failed to load projects');
//         // Fallback to empty array
//         setProjects([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // Handle loading state
//   if (loading) {
//     return (
//       <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
//         <div className="container mx-auto px-4 max-w-6xl text-center">
//           <div className="text-4xl font-bold text-gray-900 mb-4">Project Gallery</div>
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Handle error state
//   if (error) {
//     return (
//       <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
//         <div className="container mx-auto px-4 max-w-6xl text-center">
//           <div className="text-4xl font-bold text-gray-900 mb-4">Project Gallery</div>
//           <div className="text-red-500 mb-4">{error}</div>
//           <button 
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Retry
//           </button>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
//       {/* Decorative elements (keep as is) */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-0 left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//       </div>
      
//       <div className="container mx-auto px-4 max-w-6xl relative z-10">
//         <div className="text-center mb-16">
//           <motion.h2 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-4xl font-bold text-gray-900 mb-4"
//           >
//             <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
//               Project Gallery
//             </span>
//           </motion.h2>
          
//           <motion.div
//             initial={{ width: 0 }}
//             animate={{ width: "8rem" }}
//             transition={{ duration: 0.8 }}
//             className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6 rounded-full"
//           />
          
//           <motion.p 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="text-lg text-gray-600 max-w-2xl mx-auto"
//           >
//             {projects.length > 0 
//               ? `Explore ${projects.length} innovative projects created by our talented members`
//               : 'No projects available yet. Be the first to submit one!'}
//           </motion.p>
//         </div>

//         {projects.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-gray-500 mb-4">No projects found</div>
//             <a 
//               href="/projects" 
//               className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
//             >
//               Submit First Project
//             </a>
//           </div>
//         ) : (
//           <motion.div 
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//             variants={container}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true, margin: "-100px" }}
//           >
//             {projects.map((project, index) => (
//               <motion.div 
//                 key={project.id || index}
//                 className="group cursor-pointer"
//                 variants={item}
//                 whileHover={hoverCard}
//                 onClick={() => setSelectedProject(project)}
//               >
//                 <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden border border-gray-100">
//                   <div className="relative h-60 overflow-hidden">
//                     <motion.div
//                       className="w-full h-full bg-cover bg-center"
//                       style={{ 
//                         backgroundImage: `url(${project.image || '/Events/default-project.png'})`,
//                         backgroundColor: project.image ? 'transparent' : '#f3f4f6'
//                       }}
//                       initial={{ scale: 1.1 }}
//                       whileHover={hoverImage}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                    
//                     {/* Project badges */}
//                     <div className="absolute top-4 left-4 flex gap-2">
//                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                         project.status === 'Completed' || project.status === 'completed'
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {project.status || 'Ongoing'}
//                       </span>
//                       <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
//                         {project.year || '2024'}
//                       </span>
//                     </div>
                    
//                     {/* Domain badge */}
//                     <span className="absolute top-4 right-4 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">
//                       {project.domain || 'General'}
//                     </span>
//                   </div>
                  
//                   <div className="p-6">
//                     <motion.h3 
//                       className="text-xl font-bold text-gray-900 mb-3"
//                       whileHover={{ color: "#2563eb" }}
//                     >
//                       {project.title}
//                     </motion.h3>
                    
//                     <p className="text-gray-600 mb-5">{project.description}</p>
                    
//                     <div className="mb-5">
//                       <div className="flex items-center text-gray-700 mb-3">
//                         <FiCode className="mr-2 text-blue-500" />
//                         <span className="font-medium">Tech Stack</span>
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {(Array.isArray(project.techStack) 
//                           ? project.techStack 
//                           : (project.techStack || '').split(',')
//                         ).map((tech, i) => (
//                           <span 
//                             key={i} 
//                             className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
//                           >
//                             {tech.trim()}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
                    
//                     <div className="flex justify-between border-t border-gray-100 pt-4">
//                       <div className="flex gap-3">
//                         {project.github && (
//                           <motion.a
//                             href={project.github}
//                             className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//                             whileHover={{ y: -3 }}
//                             title="GitHub Repository"
//                             onClick={(e) => e.stopPropagation()}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             <FiGithub className="text-gray-700" />
//                           </motion.a>
//                         )}
//                         {project.demo && (
//                           <motion.a
//                             href={project.demo}
//                             className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//                             whileHover={{ y: -3 }}
//                             title="Live Demo"
//                             onClick={(e) => e.stopPropagation()}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             <FiExternalLink className="text-gray-700" />
//                           </motion.a>
//                         )}
//                       </div>
                      
//                       <div className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800">
//                         Project Details
//                         <FiBookOpen className="ml-2" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
        
//         <motion.div 
//           className="text-center mt-16"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//         >
//           <a 
//             href="/projects" 
//             className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow"
//           >
//             View All Projects
//             <FiExternalLink className="ml-2" />
//           </a>
//         </motion.div>
//       </div>

//       {/* Project Details Modal */}
//       {selectedProject && (
//         <ProjectDetailsModal 
//           project={selectedProject} 
//           onClose={() => setSelectedProject(null)} 
//         />
//       )}

//       <style>{`
//         @keyframes blob {
//           0%, 100% { transform: translateY(0) scale(1); }
//           50% { transform: translateY(-20px) scale(1.1); }
//         }
//         .animate-blob {
//           animation: blob 7s ease-in-out infinite;
//         }
//         .animate-blob.animation-delay-2000 {
//           animation-delay: 2s;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default ProjectCard;
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiGithub, FiExternalLink, FiCode, FiBookOpen } from 'react-icons/fi';
import ProjectDetailsModal from '../ProjectDetailsModal/ProjectDetailsModal';
import { getProjects } from '../../../api';
// Optional: import { getApprovedProjects } from '../../../utils/projectUtils';

const ProjectCard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants (unchanged)
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

  // Fetch projects → filter only approved ones
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        const allProjects = response.data || [];

        // ────────────────────────────────────────────────
        // IMPORTANT: Only show approved projects on frontend
        // ────────────────────────────────────────────────
        const approvedProjects = allProjects.filter(
          project => project.approval_status === 'approved'
        );

        // Alternative (cleaner) using utility:
        // const approvedProjects = getApprovedProjects(allProjects);

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
                className="group cursor-pointer"
                variants={item}
                whileHover={hoverCard}
                onClick={() => setSelectedProject(project)}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full flex flex-col transition-all duration-300">
                  {/* Image / Cover */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.div
                      className="w-full h-full bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${project.image || '/images/default-project.jpg'})`,
                        backgroundColor: project.image ? 'transparent' : '#f3f4f6'
                      }}
                      initial={{ scale: 1.08 }}
                      whileHover={hoverImage}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        project.status?.toLowerCase() === 'completed'
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

                    {/* Domain badge */}
                    {project.domain && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-indigo-600/90 text-white rounded-full text-xs font-bold shadow-sm">
                        {project.domain}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      {project.title}
                    </motion.h3>

                    <p className="text-gray-600 mb-5 line-clamp-3 flex-1">
                      {project.description || 'No description provided.'}
                    </p>

                    {/* Tech Stack */}
                    {project.techStack?.length > 0 && (
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 mb-2 text-sm font-medium">
                          <FiCode className="mr-2 text-blue-500" />
                          Tech Stack
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech, i) => (
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

                    {/* Links & Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
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
                        {project.demo && (
                          <motion.a
                            href={project.demo}
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

      {/* Modal */}
      {selectedProject && (
        <ProjectDetailsModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      
    </section>
  );
};

export default ProjectCard;