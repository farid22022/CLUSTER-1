import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import EventRegistrationForm from '../EventRegistrationForm/EventRegistrationForm';

// Replace with actual image imports
const datathonImage = "/Events/SynergyXDatathon.png";
const symposiumImage = "/Events/ProjectSymposium.png";
const iupcImage = "/Events/KUIUPC.png";

const EventCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      image: datathonImage,
      alt: 'Datathon',
      title: 'SynergyX Datathon 2025',
      date: 'June 15, 2025',
      venue: 'Virtual',
      description: 'Compete in data-driven challenges and win exciting prizes!',
      link: '/datathon',
      tags: ['Data Science', 'AI', 'Workshop']
    },
    {
      image: symposiumImage,
      alt: 'Symposium',
      title: 'Project Symposium 2025',
      date: 'July 10, 2025',
      venue: 'Liakot Ali Auditorium, KU',
      description: 'Showcase your projects and hear from industry leaders.',
      link: '/ps',
      tags: ['Networking', 'Exhibition', 'Keynote']
    },
    {
      image: iupcImage,
      alt: 'IUPC',
      title: 'KU IUPC 2025',
      date: 'August 5, 2025',
      venue: 'CSE Discipline, KU',
      description: 'Test your coding skills in our annual programming contest.',
      link: '/cp',
      tags: ['Competition', 'Coding', 'Algorithms']
    },
  ];

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
                    style={{ backgroundImage: `url(${event.image})` }}
                    initial={{ scale: 1.1 }}
                    whileHover={hoverImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                  
                  {/* Event tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {event.tags.map((tag, tagIndex) => (
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
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{event.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{event.venue}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{event.description}</p>
                  
                  <div className="flex justify-between">
                    <motion.a 
                      href={event.link}
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

export default EventCard;