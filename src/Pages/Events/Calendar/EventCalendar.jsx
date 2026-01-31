import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiPlus, FiDownload, FiShare2 } from 'react-icons/fi';
import PropTypes from 'prop-types';

const EventCalendar = ({ events = [] }) => {
  const [activeEvent, setActiveEvent] = useState(null);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };


  const getUpcomingEventsForSidebar = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);

      // Use is_upcoming field if available, otherwise check date
      if (event.is_upcoming !== undefined) {
        return event.is_upcoming === true && eventDate <= thirtyDaysFromNow;
      }

      return eventDate >= today && eventDate <= thirtyDaysFromNow;
    }).slice(0, 5); // Show only 5 events in the sidebar
  };

  const upcomingEvents = getUpcomingEventsForSidebar();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Event Calendar
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
            Stay updated with all our upcoming events, workshops, and competitions
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar container */}
          <motion.div
            className="lg:w-7/12 bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            </div>
            <iframe
              src="https://calendar.google.com/calendar/embed?src=en.bd%23holiday%40group.v.calendar.google.com&ctz=Asia%2FDhaka"
              style={{ border: 0 }}
              width="100%"
              height="500"
              title="CLUSTER Event Calendar"
              className="min-h-[500px]"
            ></iframe>
            <div className="p-6 border-t border-gray-200 flex justify-between items-center">
              <button className="flex items-center text-blue-600 font-medium hover:text-blue-800">
                <FiPlus className="mr-2" />
                Add to Calendar
              </button>
              <div className="flex gap-3">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <FiDownload className="text-gray-700" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <FiShare2 className="text-gray-700" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Upcoming events sidebar */}
          <motion.div
            className="lg:w-5/12"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-blue-500">
                <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
                <p className="text-blue-100">Next 30 days</p>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-blue-200">No events scheduled for the next 30 days</p>
                </div>
              ) : (
                <motion.div
                  className="divide-y divide-blue-500/30 max-h-[500px] overflow-y-auto"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {upcomingEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      className="p-6 hover:bg-blue-700/20 cursor-pointer transition-colors"
                      variants={item}
                      onClick={() => setActiveEvent(event)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                          <div className="flex items-center text-blue-100 mt-2">
                            <FiCalendar className="mr-2" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          {event.time && (
                            <div className="flex items-center text-blue-100 mt-1">
                              <FiClock className="mr-2" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          <div className="flex items-center text-blue-100 mt-1">
                            <FiMapPin className="mr-2" />
                            <span>{event.location || event.venue || 'TBA'}</span>
                          </div>
                        </div>
                        <div className="bg-blue-500/30 text-white px-3 py-1 rounded-lg text-sm">
                          {new Date(event.date).getDate()}
                        </div>
                      </div>
                      <p className="text-blue-200 mt-3 line-clamp-2">{event.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <div className="p-6 border-t border-blue-500/30">
                <a
                  href="/events"
                  className="block text-center py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
                >
                  View All Events
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{activeEvent.title}</h3>
              <button
                onClick={() => setActiveEvent(null)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center text-gray-600 mb-3">
                <FiCalendar className="mr-3 text-blue-500" />
                <span>{formatDate(activeEvent.date)} {activeEvent.time && `| ${activeEvent.time}`}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-6">
                <FiMapPin className="mr-3 text-blue-500" />
                <span>{activeEvent.location || activeEvent.venue || 'Venue TBA'}</span>
              </div>

              <p className="text-gray-700 mb-6">{activeEvent.description}</p>

              {activeEvent.links && activeEvent.links.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Resources:</h4>
                  <div className="flex gap-2">
                    {activeEvent.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.type}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg">
                  Register Now
                </button>
                <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <FiCalendar className="text-gray-700" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

EventCalendar.propTypes = {
  events: PropTypes.array,
};

export default EventCalendar;