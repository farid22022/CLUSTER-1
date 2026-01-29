import { motion } from 'framer-motion';

const Timeline = () => {
  const events = [
    {
      date: "June 25, 2025",
      title: "Intro to Machine Learning Workshop",
      description: "Hands-on session covering basic ML concepts with Python",
      time: "3:00 PM - 5:00 PM",
      location: "CS Lab 302",
      icon: "🧠"
    },
    {
      date: "July 8, 2025",
      title: "Tech Talk: Future of Web Development",
      description: "Industry expert discussing emerging web technologies",
      time: "4:00 PM - 6:00 PM",
      location: "Auditorium A",
      icon: "🌐"
    },
    {
      date: "August 12, 2025",
      title: "Hackathon Prep Session",
      description: "Get ready for our annual hackathon with team formation and idea pitching",
      time: "2:00 PM - 4:00 PM",
      location: "Innovation Lab",
      icon: "💻"
    }
  ];

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
    <section className="relative py:12 lg:py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
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

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center py-4 mb-16 bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -50, rotateX: 90 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.8
          }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ perspective: '1000px' }}
        >
          Upcoming Timeline
        </motion.h2>
        
        <div className="relative max-w-3xl mx-auto">
          {/* Enhanced Timeline line with animation */}
          <motion.div
            className="absolute left-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          />

          {/* Floating particles along timeline */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1/2"
              style={{
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
          
          {events.map((event, index) => (
            <motion.div
              key={index}
              className={`relative mb-16 ${index % 2 === 0 ? 'pr-8 md:pr-0 md:pl-8' : 'pl-8 md:pl-0 md:pr-8'}`}
              initial={{ opacity: 0, y: 50, rotateY: index % 2 === 0 ? 15 : -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8
              }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}>
                {/* Date with 3D effect */}
                <motion.div
                  className={`flex-shrink-0 w-28 h-28 p-3 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center shadow-lg z-10 ${index % 2 === 0 ? 'mr-6' : 'ml-6'}`}
                  whileHover={{ 
                    scale: 1.1,
                    rotateZ: 5,
                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
                  }}
                  style={{
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                  }}
                >
                  <div className="text-center">
                    <motion.div 
                      className="font-bold text-blue-600 text-xl"
                      whileHover={{ scale: 1.1 }}
                    >
                      {event.date.split(' ')[0]}
                    </motion.div>
                    <div className="text-sm">{event.date.split(' ')[1]}</div>
                    <motion.div 
                      className="text-2xl mt-1"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 5,
                        repeat: Infinity,
                        repeatDelay: 5
                      }}
                    >
                      {event.icon}
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Event card with 3D hover */}
                <motion.div
                  className={`flex-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}
                  whileHover={{ 
                    y: -10,
                    rotateX: 5,
                    rotateY: index % 2 === 0 ? 5 : -5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <motion.h3 
                    className="text-xl font-bold text-gray-800 mb-2"
                    whileHover={{ 
                      scale: 1.02,
                      textShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
                    }}
                  >
                    {event.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 mb-4"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {event.description}
                  </motion.p>
                  
                  <motion.div 
                    className={`flex text-sm text-gray-500 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                    whileHover={{ x: index % 2 === 0 ? 5 : -5 }}
                  >
                    <motion.svg 
                      className="w-4 h-4 mr-2" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </motion.svg>
                    {event.time}
                    <motion.svg 
                      className="w-4 h-4 ml-4 mr-2" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      whileHover={{ scale: 1.3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </motion.svg>
                    {event.location}
                  </motion.div>

                  {/* Floating elements inside card */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-2 h-2 bg-blue-400 rounded-full ${index % 2 === 0 ? 'right-4' : 'left-4'}`}
                      style={{
                        top: `${30 + i * 20}%`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA at bottom */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="/events"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-xl border border-white/20 backdrop-blur-sm relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(129, 140, 248, 0.4)",
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">View All Events</span>
            <motion.svg
              className="w-5 h-5 ml-3 relative z-10"
              fill="currentColor"
              viewBox="0 0 20 20"
              whileHover={{ x: 3, rotate: 10 }}
            >
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </motion.svg>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;