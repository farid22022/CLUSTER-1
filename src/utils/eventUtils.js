// src/utils/eventUtils.js

// Helper function to check if an event is upcoming using the is_upcoming field
export const isEventUpcoming = (event) => {
  // Use the is_upcoming field if available, otherwise fall back to date comparison
  if (event.is_upcoming !== undefined) {
    return event.is_upcoming === true;
  }
  
  // Fallback: check by date
  if (!event.date) return false;
  
  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return eventDate >= today;
};

// Helper function to check if an event is past using the is_upcoming field
export const isEventPast = (event) => {
  // Use the is_upcoming field if available, otherwise fall back to date comparison
  if (event.is_upcoming !== undefined) {
    return event.is_upcoming === false;
  }
  
  // Fallback: check by date
  if (!event.date) return false;
  
  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return eventDate < today;
};

// Get upcoming events from array
export const getUpcomingEvents = (events) => {
  return events
    .filter(isEventUpcoming)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Get past events from array
export const getPastEvents = (events) => {
  return events
    .filter(isEventPast)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
};

// Get events happening today
export const getTodayEvents = (events) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return events.filter(event => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate >= today && eventDate < tomorrow;
  });
};

// Get events for specific month
export const getEventsByMonth = (events, year, month) => {
  return events.filter(event => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
};