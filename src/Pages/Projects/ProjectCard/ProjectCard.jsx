import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiGithub, FiExternalLink, FiCode, FiBookOpen } from 'react-icons/fi';
import ProjectDetailsModal from '../ProjectDetailsModal/ProjectDetailsModal';


// Replace with actual image imports
const innovationImage = "/Events/innovationImage.png";
const smartCampusIOT = "/Events/smartCampusIOT.png";
const OpenSourceELearning = "/Events/OpenSourceELearning.png";

const ProjectCard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const projects = [
    {
      image: innovationImage,
      title: 'AI-Powered Healthcare System',
      description: 'A machine learning model for early disease detection using real-time patient data analysis with 92% accuracy in clinical trials.',
      techStack: ['Python', 'TensorFlow', 'React', 'Node.js', 'MongoDB'],
      status: 'Completed',
      team: ['Team NeuralNet', 'John Doe', 'Jane Smith'],
      github: 'https://github.com/cluster/ai-healthcare',
      demo: 'https://demo.cluster.cseku.ac.bd',
      year: '2024',
      domain: 'AI/ML',
    },
    {
      image: smartCampusIOT,
      title: 'Smart Campus IoT',
      description: 'IoT-based system for campus resource management optimizing energy usage by 35% and improving facility utilization tracking.',
      techStack: ['Node.js', 'Arduino', 'MongoDB', 'AWS IoT', 'React Native'],
      status: 'Ongoing',
      team: ['Team IoT Innovators', 'Alice Brown', 'Robert Chen'],
      github: 'https://github.com/cluster/smart-campus',
      year: '2025',
      domain: 'IoT',
    },
    {
      image: OpenSourceELearning,
      title: 'Open-Source E-Learning Platform',
      description: 'A comprehensive platform for accessible tech education with interactive coding exercises and real-time collaboration features.',
      techStack: ['React', 'Firebase', 'Tailwind CSS', 'TypeScript', 'Redux'],
      status: 'Completed',
      team: ['Team EduTech', 'Bob Wilson', 'Sarah Johnson'],
      github: 'https://github.com/cluster/e-learning',
      demo: 'https://elearning.cluster.cseku.ac.bd',
      year: '2023',
      domain: 'Web Development',
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  const hoverCard = {
    y: -10,
    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  };

  const hoverImage = {
    scale: 1.05,
    transition: { 
      duration: 0.3 
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
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
            Explore innovative projects created by our talented members
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              className="group cursor-pointer"
              variants={item}
              whileHover={hoverCard}
              onClick={() => setSelectedProject(project)}
            >
              <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden border border-gray-100">
                <div className="relative h-60 overflow-hidden">
                  <motion.div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.image})` }}
                    initial={{ scale: 1.1 }}
                    whileHover={hoverImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                  
                  {/* Project badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                      {project.year}
                    </span>
                  </div>
                  
                  {/* Domain badge */}
                  <span className="absolute top-4 right-4 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">
                    {project.domain}
                  </span>
                </div>
                
                <div className="p-6">
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    whileHover={{ color: "#2563eb" }}
                  >
                    {project.title}
                  </motion.h3>
                  
                  <p className="text-gray-600 mb-5">{project.description}</p>
                  
                  <div className="mb-5">
                    <div className="flex items-center text-gray-700 mb-3">
                      <FiCode className="mr-2 text-blue-500" />
                      <span className="font-medium">Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-100 pt-4">
                    <div className="flex gap-3">
                      {project.github && (
                        <motion.a
                          href={project.github}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          whileHover={{ y: -3 }}
                          title="GitHub Repository"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiGithub className="text-gray-700" />
                        </motion.a>
                      )}
                      {project.demo && (
                        <motion.a
                          href={project.demo}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          whileHover={{ y: -3 }}
                          title="Live Demo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiExternalLink className="text-gray-700" />
                        </motion.a>
                      )}
                    </div>
                    
                    <div className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800">
                      Project Details
                      <FiBookOpen className="ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <a 
            href="/projects" 
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            View All Projects
            <FiExternalLink className="ml-2" />
          </a>
        </motion.div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        .animate-blob.animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default ProjectCard;