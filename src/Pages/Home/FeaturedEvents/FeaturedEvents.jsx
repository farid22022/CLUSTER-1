import { motion } from 'framer-motion';

const FeaturedEvents = () => {
  const events = [
  {
    image: '/Events/SparkTank.png',
    alt: 'Spark Tank 1.0',
    title: 'Spark Tank 1.0 Idea Expo',
    date: '4 August 2025',
    time: '09:00 AM',
    location: 'CSE Discipline, Khulna University',
    description:
      'Showcase your innovation and ideas in intra-discipline Spark Tank 1.0 Idea Expo. The winner will be recognized from CLUSTER and CSE Discipline (Project Showcasing for 21, 22, 23 batch - Database Systems Project, Web Development Project, and Idea Showcasing for 24 batch). Registration is Free. Submit your poster within 1 August 2025.',
    link: '/spark-tank',
    tags: ['Innovation', 'Showcase', 'Free Registration']
  },
  {
    image: '/Events/SynergyXDatathon.png',
    alt: 'SynergyX Datathon 2025',
    title: 'SynergyX Datathon 2025',
    date: 'June 15, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'Innovation Center, Room 301',
    description:
      'Compete in SynergyX Datathon 2025 and solve real-world data problems using data science and machine learning. This intra-discipline event is open to students from the 21, 22, and 23 batches. Showcase your analytical thinking and problem-solving abilities. Winners will receive certificates and exclusive prizes. Registration is Free. Submit your team details by 10 June 2025.',
    link: '/datathon',
    tags: ['Data Science', 'AI', 'Workshop']
  },
  {
    image: '/Events/KUIUPC.png',
    alt: 'KU IUPC 2025',
    title: 'KU IUPC 2025',
    date: 'August 5, 2025',
    time: '8:00 AM - 8:00 PM',
    location: 'Tech Hub, Building A',
    description:
      'Join the ultimate coding battle at KU IUPC 2025 – the annual intra-discipline programming contest. Designed for the best minds from 21, 22, and 23 batches to solve algorithmic and logical problems under pressure. Compete solo or in teams, win exclusive prizes, and earn recognition from CLUSTER and CSE Discipline. Registration is Free. Register your team by 1 August 2025.',
    link: '/cp',
    tags: ['Competition', 'Coding', 'Algorithms']
  }
];

  // Enhanced animation variants with 3D effects
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: {
      opacity: 0,
      x: 200,
      y: -100,
      rotateX: 45,
      rotateY: 25,
      scale: 0.8
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const cardHover = {
    y: -15,
    rotateX: 5,
    rotateY: 5,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  };

  const imageHover = {
    scale: 1.2,
    rotateZ: 2,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  };

  // Floating animation for background elements
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const floatingAnimationDelay = {
    y: [0, -15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2
    }
  };

  return (
    <div>
      <section className="relative py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={floatingAnimation}
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={floatingAnimationDelay}
            className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-300/15 to-pink-300/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-300/10 to-blue-300/10 rounded-full blur-2xl"
          />
        </div>

        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full"
               style={{
                 backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.2) 1px, transparent 0)`,
                 backgroundSize: '50px 50px'
               }}>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: -50, rotateX: 90 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8,
                delay: 0.1
              }}
              className="text-4xl py-4 md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
              style={{ perspective: '1000px' }}
            >
              Upcoming Events
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ margin: "-100px" }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 10,
                duration: 0.6,
                delay: 0.4
              }}
              className="text-xl text-gray-600 max-w-3xl mt-5 mx-auto leading-relaxed"
            >
              Discover our flagship events designed to inspire, educate, and connect innovators across the globe.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ margin: "-150px" }}
            style={{ perspective: '1200px' }}
          >
            {events.map((event, index) => (
              <motion.div
                key={index}
                className="group"
                variants={item}
                whileHover={cardHover}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col border border-gray-200/50 hover:border-gray-300/50 transition-all duration-500">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className="relative h-60 overflow-hidden">
                    <motion.img
                      src={event.image}
                      alt={event.alt}
                      className="w-full mx-auto h-64 object-cover"
                      initial={{ scale: 1.2, rotateZ: 5 }}
                      whileHover={imageHover}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-gray-900/20 to-transparent"></div>

                    <motion.div
                      className="absolute bottom-4 left-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ margin: "-50px" }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, tagIndex) => (
                          <motion.span
                            key={tagIndex}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-gray-300/30"
                            whileHover={{
                              scale: 1.1,
                              background: "linear-gradient(to right, #3b82f6, #a855f7)"
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col relative">
                    <div className="mb-6">
                      <motion.h3
                        className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300"
                        whileHover={{
                          scale: 1.05,
                          textShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                        }}
                      >
                        {event.title}
                      </motion.h3>

                      <motion.div
                        className="space-y-3 mb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ margin: "-50px" }}
                        transition={{ delay: 0.6 + index * 0.1, stiffness: 100, damping: 15 }}
                      >
                        <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors">
                          <motion.svg
                            className="w-5 h-5 mr-3 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.5 }}
                          >
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </motion.svg>
                          <span className="font-medium">{event.date}</span>
                        </div>

                        <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors">
                          <motion.svg
                            className="w-5 h-5 mr-3 text-purple-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            whileHover={{ rotate: 180, scale: 1.2 }}
                            transition={{ duration: 0.5 }}
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </motion.svg>
                          <span className="font-medium">{event.time}</span>
                        </div>

                        <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors">
                          <motion.svg
                            className="w-5 h-5 mr-3 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            whileHover={{ scale: 1.3, y: -2 }}
                            transition={{ duration: 0.3 }}
                          >
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </motion.svg>
                          <span className="font-medium">{event.location}</span>
                        </div>
                      </motion.div>

                      <motion.p
                        className="text-gray-600 mb-6 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-50px" }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        {event.description}
                      </motion.p>
                    </div>

                    <div className="mt-auto">
                      <motion.a
                        href={event.link}
                        className="inline-flex items-center font-bold text-blue-600 group-hover:text-blue-500 transition-all duration-300 relative"
                        whileHover={{
                          x: 10,
                          textShadow: "0 0 10px rgba(59, 130, 246, 0.7)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10">Learn more</span>
                        <motion.svg
                          className="w-5 h-5 ml-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          whileHover={{ x: 5, rotate: 15 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </motion.svg>
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ margin: "-100px" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 1.2
            }}
          >
            <motion.a
              href="/events"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold text-lg rounded-full shadow-2xl border border-gray-300/30 backdrop-blur-sm relative overflow-hidden group"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">View All Events</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturedEvents;