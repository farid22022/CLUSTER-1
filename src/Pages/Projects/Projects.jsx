import { useEffect, useState } from "react";

import ProjectCard from "./ProjectCard/ProjectCard";
import SubmissionForm from "./SubmissionForm/SubmissionForm";
import { motion } from "framer-motion";

const Projects = () => {
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);
  const [refreshProjects, setRefreshProjects] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleProjectSubmitted = () => {
    // This can be used to trigger a refresh of projects when a new one is submitted
    setRefreshProjects(prev => !prev);
    setIsSubmissionFormOpen(false);
  };

  return (
    <div className="bg-gray-50 font-sans">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 md:py-40 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-3 md:mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Innovate with CLUSTER Projects
          </motion.h1>
          <motion.p 
            className="text-base md:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Unleash your creativity with groundbreaking KU CSE projects in AI, IoT, and more!
          </motion.p>
          <motion.button
            onClick={() => setIsSubmissionFormOpen(true)}
            className="mt-6 bg-white text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Submit Your Project
          </motion.button>
        </div>
      </section>

      <ProjectCard key={refreshProjects ? 'refresh' : 'initial'} />
      
      {isSubmissionFormOpen && (
        <SubmissionForm 
          onClose={() => setIsSubmissionFormOpen(false)}
          onSuccess={handleProjectSubmitted}
        />
      )}
    </div>
  );
};

export default Projects;