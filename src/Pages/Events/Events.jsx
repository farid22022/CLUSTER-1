import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventFilters from "./EventFilters/EventFilters";
import EventCard from "./EventCard/EventCard";
import EventArchive from "./EventArchive/EventArchive";
import EventCalendar from "./Calendar/EventCalendar";

const Events = () => {
  const [view, setView] = useState('grid'); // Toggle between grid and calendar view
  const [filtersOpen, setFiltersOpen] = useState(false);
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="bg-gray-50  font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 md:py-40 px-4 text-center">
  <div className="container mx-auto max-w-4xl">
    <motion.h1 
      className="text-4xl md:text-6xl font-bold mb-3 md:mb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      Unleash Your Tech Potential with CLUSTER
    </motion.h1>
    <motion.p 
      className="text-base md:text-lg max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      Dive into electrifying hackathons, workshops, datathons, and symposiums to fuel your innovation!
    </motion.p>
  </div>
</section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Filters Section */}
        <div className="mb-8">
          {/* Filter Toggle for Mobile */}
          <motion.button
            className="lg:hidden w-full py-3 px-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between shadow-sm mb-4"
            onClick={() => setFiltersOpen(!filtersOpen)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span>{filtersOpen ? 'Hide Filters' : 'Show Filters'}</span>
            <motion.svg 
              className="w-5 h-5 text-gray-500"
              animate={{ rotate: filtersOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.button>

          {/* Filters Content */}
          <AnimatePresence>
            {(filtersOpen || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <EventFilters 
                  setView={setView} 
                  currentView={view} 
                  onApply={() => setFiltersOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Toggle for Mobile */}
        <div className="lg:hidden flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
            <motion.button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Grid
            </motion.button>
            <motion.button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'calendar' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Calendar
            </motion.button>
          </div>
        </div>
        
        {/* View Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {view === 'grid' ? <EventCard /> : <EventCalendar />}
        </div>
        
        {/* Event Archive */}
        <div className="mt-10">
          <EventArchive />
        </div>
      </div>
    </div>
  );
};

export default Events;