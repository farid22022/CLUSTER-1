import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import EventRegistrationForm from '../EventRegistrationForm/EventRegistrationForm';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import PropTypes from 'prop-types';

const EventCard = ({ events = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get default image if none provided
  const getEventImage = (event) => {
    if (event.image) return event.image;
    // Return default images based on event type or use a placeholder
    if (event.tags && event.tags.includes('datathon')) {
      return "/Events/SynergyXDatathon.png";
    } else if (event.tags && event.tags.includes('symposium')) {
      return "/Events/ProjectSymposium.png";
    } else if (event.tags && event.tags.includes('programming')) {
      return "/Events/KUIUPC.png";
    }
    return "/Events/default-event.png";
  };

  if (events.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Upcoming Events</h2>
          <p className="text-gray-600 mb-8">Check back later for new events!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
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
              Upcoming Events
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
            Join our flagship events designed to inspire, educate, and connect innovators
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {events.map((event, index) => (
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
                    style={{ backgroundImage: `url(${getEventImage(event)})` }}
                    initial={{ scale: 1.1 }}
                    whileHover={hoverImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                  
                  {/* Event tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {event.tags && event.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="bg-blue-600 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <motion.h3 
                      className="text-xl font-bold text-gray-900"
                      whileHover={{ color: "#2563eb" }}
                    >
                      {event.title}
                    </motion.h3>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <FiCalendar className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  {event.time && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <FiClock className="w-5 h-5 mr-2 text-blue-500" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <FiMapPin className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{event.location || event.venue || 'TBA'}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{event.description}</p>
                  
                  <div className="flex justify-between">
                    <motion.a 
                      href={`/events/${event.id}`}
                      className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      whileHover={{ 
                        x: 5,
                        transition: { type: "spring", stiffness: 400 }
                      }}
                    >
                      Learn more
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.a>
                    
                    <motion.button
                      onClick={() => handleRegisterClick(event)}
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 5px 15px -3px rgba(59, 130, 246, 0.5)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Register
                    </motion.button>
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
            href="/events" 
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            View All Events
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isModalOpen && (
          <EventRegistrationForm
            event={selectedEvent}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

EventCard.propTypes = {
  events: PropTypes.array,
};

export default EventCard;