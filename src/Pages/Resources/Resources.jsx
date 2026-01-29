import { motion } from 'framer-motion';

import ResourceFilters from './ResourceFilters/ResourceFilters';
import ResourceCard from './ResourceCard/ResourceCard';

import { FiBook } from 'react-icons/fi';
import { useEffect } from 'react';

const Resources = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-40 text-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-soft-light filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-soft-light filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-6"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Empower Your Tech Journey with CLUSTER Resources
      </motion.h1>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "10rem" }}
        transition={{ duration: 0.8 }}
        className="h-1.5 bg-white mx-auto mb-6 rounded-full"
      />
      
      <motion.p 
        className="text-xl max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Dive into a treasure trove of knowledge, from competitive programming guides to cutting-edge research papers and tutorials.
      </motion.p>
          
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href="#resources"
              className="px-6 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-gray-100 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiBook className="mr-2" />
              Browse Resources
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
      
      <ResourceFilters />
      <ResourceCard />
    </div>
  );
};

export default Resources;