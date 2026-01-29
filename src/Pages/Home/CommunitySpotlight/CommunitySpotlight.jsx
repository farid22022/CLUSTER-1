import { motion } from 'framer-motion';

const CommunitySpotlight = () => {
  const spotlights = [
    {
      title: 'QBeamformer Paper Award at KCC 2025',
      image: 'https://i.imghippo.com/files/Dhsr8583Jzc.jpeg',
      subtitle: 'Awared to Avi Deb Raha, batch 2016',
      description: 'I am delighted to share that our paper titled \'QBeamformer: Quantum Transformer Empowered mmWave Beamforming for UAVs in NextG Wireless Networks\' has been awarded as best of the best papers (Excellent Paper) in the \'Information and Communication\' section at the Korea Computer Congress Conference 2025 (KCC 2025). Thanks to the co-authors for their contributions and my professor for his guidance. Thanks to my family for the support and to the Almighty for everything.',
      link: '/research',
      icon: '📜',
      color: 'from-blue-500 to-cyan-500',
      bgPattern: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Alumnus Spotlight: C M Khaled Saifullah',
      image: 'https://i.imghippo.com/files/NJDZ6722sgQ.jpg',
      subtitle: 'Batch 2011, Software Engineer at Microsoft',
      description: 'Khaled reflects on his transformative journey from CLUSTER, where he honed his technical prowess, to becoming a key contributor at Microsoft since October 2022. With over 5 years of experience in large-scale software development, he excels in writing clean, high-quality code across languages like Java, Python, and React.js. His expertise spans designing bug-free applications, conducting test-driven development, and troubleshooting complex issues using tools like Git and Jira. Khaled’s strong collaboration skills shine as he navigates fast-paced environments, manages tight deadlines, and contributes to comprehensive code reviews, all while staying ahead of tech trends with Docker, Kubernetes, and SQL databases.',
      link: '/alumni/khaled-saifullah',
      icon: '🌟',
      color: 'from-purple-500 to-pink-500',
      bgPattern: 'from-purple-50 to-pink-50'
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -60,
      rotateX: 45
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      rotateY: 25,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        duration: 0.8
      }
    }
  };

  const cardHover = {
    y: -15,
    rotateX: 8,
    rotateY: 5,
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  };

  // Floating animation for background elements
  const floatingAnimation = {
    y: [0, -20, 0],
    rotate: [0, 3, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const floatingAnimationDelay = {
    y: [0, -15, 0],
    rotate: [0, -2, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 3
    }
  };

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-200/30 to-cyan-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={floatingAnimationDelay}
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-200/25 to-pink-300/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            transition: {
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }
          }}
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-indigo-200/20 to-blue-300/20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"
        />

        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" className="absolute inset-0">
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <motion.div 
        className="container mx-auto px-4 max-w-6xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Enhanced Title Section */}
        <div className="text-center mb-20">
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-4 py-4 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent"
            variants={titleVariants}
            style={{ perspective: '1000px' }}
          >
            Community Spotlight
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.p
            className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Celebrating the achievements and innovations of our vibrant community
          </motion.p>
        </div>

        {/* Enhanced Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {spotlights.map((spotlight, index) => (
            <motion.div 
              key={index} 
              className="group"
              variants={cardVariants}
              whileHover={cardHover}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={`relative bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/40 hover:border-white/60 transition-all duration-500 h-full`}>
                {/* Card Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Gradient Header */}
                <div className={`relative h-32 bg-gradient-to-r ${spotlight.color} overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                      backgroundSize: '200% 200%'
                    }}
                  />
                  
                  {/* Icon */}
                  <motion.div
                    className="absolute top-6 left-6 text-6xl"
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 15,
                      textShadow: "0 0 20px rgba(255,255,255,0.8)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {spotlight.icon}
                  </motion.div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/40 rounded-full"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 2) * 40}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.4, 0.8, 0.4],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 3 + i * 0.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                
                {/* Content */}
                <div className="p-8 relative">
                  {/* Image Background */}
                <div className='w-full h-64 relative overflow-hidden rounded-lg shadow-lg mb-6 group'>
                  <motion.img
                    src={spotlight.image}
                    alt={spotlight.title}
                    className='h-full w-full object-cover rounded-lg shadow-lg mb-6 group-hover:scale-105 transition-transform duration-500'
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.05 }}  
                    transition={{ duration: 0.5 }}
                  />
                </div>
                  <motion.h3 
                    className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300"
                    whileHover={{ 
                      scale: 1.02,
                      textShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
                    }}
                  >
                    {spotlight.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-lg font-medium text-gray-600 mb-4"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {spotlight.subtitle}
                  </motion.p>
                  
                  <motion.p 
                    className="text-gray-700 mb-8 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {spotlight.description}
                  </motion.p>
                  
                  {/* Enhanced CTA Button */}
                  <motion.div className="flex justify-end">
                    <motion.a 
                      href={spotlight.link}
                      className={`group/btn relative inline-flex items-center px-8 py-3 bg-gradient-to-r ${spotlight.color} text-white font-bold rounded-full shadow-lg overflow-hidden`}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                        y: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 mr-2">
                        {spotlight.link === '/research' ? 'View Research' : 'Read More'}
                      </span>
                      <motion.svg 
                        className="w-5 h-5 relative z-10" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        whileHover={{ x: 5, rotate: 15 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </motion.svg>
                      
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    </motion.a>
                  </motion.div>
                </div>

                {/* Decorative Corner Element */}
                <motion.div
                  className="absolute bottom-0 right-0 w-20 h-20 opacity-10"
                  whileHover={{ scale: 1.2, rotate: 45 }}
                >
                  <div className={`w-full h-full bg-gradient-to-tl ${spotlight.color} transform rotate-45 translate-x-10 translate-y-10`}></div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-xl text-gray-600 mb-8"
            whileHover={{ scale: 1.02 }}
          >
            Want to be featured in our next spotlight?
          </motion.p>
          <motion.a
            href="/submit-story"
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-2xl border border-white/20 backdrop-blur-sm relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(129, 140, 248, 0.4)",
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Share Your Story</span>
            <motion.svg
              className="w-5 h-5 ml-3 relative z-10"
              fill="currentColor"
              viewBox="0 0 20 20"
              whileHover={{ x: 3, rotate: 10 }}
            >
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </motion.svg>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CommunitySpotlight;