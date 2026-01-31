import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventFilters from "./EventFilters/EventFilters";
import EventCard from "./EventCard/EventCard";
import EventArchive from "./EventArchive/EventArchive";
import EventCalendar from "./Calendar/EventCalendar";
import { getEvents } from "../../api";
import { getPastEvents, getUpcomingEvents } from "../../utils/eventUtils";

const Events = () => {
  const [view, setView] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [filteredUpcomingEvents, setFilteredUpcomingEvents] = useState([]);
  const [filteredPastEvents, setFilteredPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    dateRange: '',
    search: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllEvents();
  }, []);

  // Apply filters whenever filters or allEvents change
  useEffect(() => {
    applyFilters();
  }, [filters, allEvents]);

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      // Fetch all events
      const response = await getEvents(1, 100);
      const events = response.data.results || response.data;
      
      setAllEvents(events);
      
      // Separate events into upcoming and past using is_upcoming field
      const upcoming = getUpcomingEvents(events);
      const past = getPastEvents(events);
      
      console.log('Upcoming events count:', upcoming.length);
      console.log('Past events count:', past.length);
      
      setUpcomingEvents(upcoming);
      setPastEvents(past);
      setFilteredUpcomingEvents(upcoming);
      setFilteredPastEvents(past);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events. Please try again later.');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!allEvents.length) return;

    let filtered = [...allEvents];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title?.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter (based on tags)
    if (filters.type && filters.type !== '') {
      filtered = filtered.filter(event => {
        if (event.tags && event.tags.length > 0) {
          return event.tags.some(tag => 
            tag.toLowerCase().includes(filters.type.toLowerCase())
          );
        }
        return false;
      });
    }

    // Apply category filter
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(event => {
        // Map event tags to categories
        if (event.tags && event.tags.length > 0) {
          const tagMap = {
            'Tech': ['technology', 'AI', 'web', 'mobile', 'software'],
            'Career': ['career', 'job', 'internship', 'professional'],
            'Academic': ['academic', 'education', 'learning', 'workshop'],
            'Social': ['social', 'networking', 'meetup'],
            'Networking': ['networking', 'meetup', 'social']
          };
          
          const categoryTags = tagMap[filters.category] || [];
          return event.tags.some(tag => 
            categoryTags.includes(tag.toLowerCase())
          );
        }
        return false;
      });
    }

    // Apply date filter
    if (filters.dateRange) {
      const today = new Date();
      switch (filters.dateRange) {
        case 'Upcoming':
          // Use is_upcoming field for upcoming events
          filtered = filtered.filter(event => event.is_upcoming === true);
          break;
        case 'Past':
          // Use is_upcoming field for past events
          filtered = filtered.filter(event => event.is_upcoming === false);
          break;
        case 'This Week':
          const weekFromNow = new Date();
          weekFromNow.setDate(today.getDate() + 7);
          filtered = filtered.filter(event => {
            if (!event.date) return false;
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= weekFromNow;
          });
          break;
        case 'This Month':
          const monthFromNow = new Date();
          monthFromNow.setMonth(today.getMonth() + 1);
          filtered = filtered.filter(event => {
            if (!event.date) return false;
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= monthFromNow;
          });
          break;
        default:
          break;
      }
    }

    // Separate filtered events using is_upcoming field
    const upcoming = filtered.filter(event => event.is_upcoming === true)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const past = filtered.filter(event => event.is_upcoming === false)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredUpcomingEvents(upcoming);
    setFilteredPastEvents(past);
    
    console.log('Filtered upcoming:', upcoming.length);
    console.log('Filtered past:', past.length);
  };

  const handleFilterChange = (newFilters) => {
    console.log('Setting new filters:', newFilters);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    setFilters({
      type: '',
      category: '',
      dateRange: '',
      search: ''
    });
    setFilteredUpcomingEvents(upcomingEvents);
    setFilteredPastEvents(pastEvents);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchAllEvents}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans">
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
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Showing {filteredUpcomingEvents.length} upcoming event{filteredUpcomingEvents.length !== 1 ? 's' : ''} 
              {' '}and {filteredPastEvents.length} past event{filteredPastEvents.length !== 1 ? 's' : ''}
            </p>
          </div>
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
          {view === 'grid' ? (
            <EventCard events={filteredUpcomingEvents} />
          ) : (
            <EventCalendar events={filteredUpcomingEvents} />
          )}
        </div>
        
        {/* Event Archive */}
        <div className="mt-10">
          <EventArchive events={filteredPastEvents} />
        </div>
      </div>
    </div>
  );
};

export default Events;