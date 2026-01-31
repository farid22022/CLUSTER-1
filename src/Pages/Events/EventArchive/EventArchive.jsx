import { motion } from 'framer-motion';
import { FiCalendar, FiImage, FiYoutube, FiFileText, FiArrowRight } from 'react-icons/fi';
import PropTypes from 'prop-types';

const EventArchive = ({ events = [] }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get default image if none provided
  const getEventImage = (event) => {
    if (event.image) return event.image;
    // Return default images based on event type or use a placeholder
    return "/Events/default-event.png";
  };

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

  if (events.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Past Events</h2>
          <p className="text-gray-600">Check out our upcoming events!</p>
        </div>
      </section>
    );
  }

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
          {events.map((event, index) => (
            <motion.div 
              key={event.id}
              className="group"
              variants={item}
              whileHover={hoverCard}
            >
              <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden border border-gray-100">
                <div className="relative h-60 overflow-hidden">
                  <motion.div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getEventImage(event)})` }}
                    initial={{ scale: 1.1 }}
                    whileHover={hoverImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                  
                  {/* Event year badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-bold px-4 py-1 rounded-full">
                    {new Date(event.date).getFullYear()}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <FiCalendar className="text-blue-500 mr-2" />
                    <span className="text-gray-600 font-medium">{formatDate(event.date)}</span>
                  </div>
                  
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    whileHover={{ color: "#2563eb" }}
                  >
                    {event.title}
                  </motion.h3>
                  
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  {event.highlights && event.highlights.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Event Highlights:</h4>
                      <ul className="space-y-1">
                        {event.highlights.slice(0, 3).map((highlight, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-gray-600">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      {event.links && event.links.length > 0 ? (
                        event.links.slice(0, 3).map((link, linkIndex) => (
                          <motion.a
                            key={linkIndex}
                            href={link.url}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            whileHover={{ y: -3 }}
                            title={link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                          >
                            {linkIcons[link.type] || <FiFileText className="w-5 h-5" />}
                          </motion.a>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No links available</span>
                      )}
                    </div>
                    
                    <motion.a
                      href={`/events/${event.id}`}
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

EventArchive.propTypes = {
  events: PropTypes.array,
};

export default EventArchive;