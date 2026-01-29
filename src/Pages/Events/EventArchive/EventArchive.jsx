import { motion } from 'framer-motion';
import { FiCalendar, FiImage, FiYoutube, FiFileText, FiArrowRight } from 'react-icons/fi';

// Replace with actual image imports
const symposiumTalkImage = "/Events/symposiumTalkImage.png";
const techTalkImage = "/Events/techTalkImage.png";
const datathonImage = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4";
const iupcImage = "https://images.unsplash.com/photo-1553877522-43269d4ea984";

const EventArchive = () => {
  const pastEvents = [
    {
      image: symposiumTalkImage,
      title: 'Project Symposium 2024',
      date: 'July 10, 2024',
      description: 'A showcase of innovative projects with guest speakers from industry leaders including Google, Microsoft, and local startups.',
      highlights: ['50+ projects showcased', '12 industry speakers', '5 winning teams awarded'],
      links: [
        { type: 'photos', url: '#' },
        { type: 'videos', url: '#' },
        { type: 'report', url: '#' }
      ]
    },
    {
      image: datathonImage,
      title: 'SynergyX Datathon 2024',
      date: 'May 15, 2024',
      description: 'Data science competition focusing on real-world problems with datasets provided by industry partners.',
      highlights: ['200+ participants', '3 problem tracks', '$5000 in prizes'],
      links: [
        { type: 'photos', url: '#' },
        { type: 'videos', url: '#' },
        { type: 'report', url: '#' }
      ]
    },
    {
      image: iupcImage,
      title: 'KU IUPC 2024',
      date: 'April 5, 2024',
      description: 'Annual intra-university programming contest challenging students with algorithmic problems.',
      highlights: ['25 teams competed', '5-hour competition', '3 winners selected'],
      links: [
        { type: 'photos', url: '#' },
        { type: 'videos', url: '#' },
        { type: 'report', url: '#' }
      ]
    },
    {
      image: techTalkImage,
      title: 'Tech Talk Series 2023',
      date: 'December 12, 2023',
      description: 'Monthly tech talks covering emerging technologies in AI, blockchain, and cloud computing.',
      highlights: ['8 sessions held', '15 expert speakers', '300+ attendees'],
      links: [
        { type: 'photos', url: '#' },
        { type: 'videos', url: '#' },
        { type: 'report', url: '#' }
      ]
    }
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
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
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

  const linkIcons = {
    photos: <FiImage className="w-5 h-5" />,
    videos: <FiYoutube className="w-5 h-5" />,
    report: <FiFileText className="w-5 h-5" />
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
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
              Event Archive
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
            Relive the moments from our past events, workshops, and competitions
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {pastEvents.map((event, index) => (
            <motion.div 
              key={index}
              className="group"
              variants={item}
              whileHover={hoverCard}
            >
              <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden border border-gray-100">
                <div className="relative h-60 overflow-hidden">
                  <motion.div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.image})` }}
                    initial={{ scale: 1.1 }}
                    whileHover={hoverImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                  
                  {/* Event year badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-bold px-4 py-1 rounded-full">
                    {event.date.split(' ')[2]}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <FiCalendar className="text-blue-500 mr-2" />
                    <span className="text-gray-600 font-medium">{event.date}</span>
                  </div>
                  
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    whileHover={{ color: "#2563eb" }}
                  >
                    {event.title}
                  </motion.h3>
                  
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Event Highlights:</h4>
                    <ul className="space-y-1">
                      {event.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      {event.links.map((link, linkIndex) => (
                        <motion.a
                          key={linkIndex}
                          href={link.url}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          whileHover={{ y: -3 }}
                          title={link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                        >
                          {linkIcons[link.type]}
                        </motion.a>
                      ))}
                    </div>
                    
                    <motion.a
                      href="#"
                      className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
                      whileHover={{ 
                        x: 5,
                        transition: { type: "spring", stiffness: 400 }
                      }}
                    >
                      Event Recap
                      <FiArrowRight className="ml-2" />
                    </motion.a>
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
            href="/events/archive" 
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            Browse Full Archive
            <FiArrowRight className="ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default EventArchive;