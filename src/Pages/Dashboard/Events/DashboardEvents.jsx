
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Search, Edit3, Trash, Upload, CheckCircle,
  MapPin, Clock, FileText, Image as ImageIcon, Link as LinkIcon,
  Download, Plus
} from 'lucide-react';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import {
  getEvents, createEvent, updateEvent, deleteEvent
} from '../../../api';

const getEventColor = (isUpcoming) => ({
  true: 'bg-gradient-to-r from-blue-600 to-indigo-700',
  false: 'bg-gradient-to-r from-gray-600 to-gray-800'
}[isUpcoming] || 'bg-emerald-600');

const getEventIcon = (isUpcoming) => ({
  true: <Calendar className="w-9 h-9" />,
  false: <FileText className="w-9 h-9" />
}[isUpcoming]);

// ────────────────────────────────────────────────
// CSV Export
// ────────────────────────────────────────────────
const exportToCSV = (events, filename) => {
  if (events.length === 0) {
    Swal.fire('No Data', 'No events to export.', 'info');
    return;
  }

  const headers = [
    'Title', 'Date', 'Time', 'Location', 'Venue', 'Description',
    'Image', 'Tags', 'Link', 'Highlights', 'Is Upcoming'
  ];

  const rows = events.map(e => {
    // Safely handle tags and highlights
    const tags = Array.isArray(e.tags) ? e.tags : 
                (typeof e.tags === 'string' ? 
                  e.tags.split(',').map(t => t.trim()).filter(Boolean) 
                  : []);
    const highlights = Array.isArray(e.highlights) ? e.highlights : 
                      (typeof e.highlights === 'string' ? 
                        e.highlights.split(',').map(h => h.trim()).filter(Boolean) 
                        : []);
    
    return [
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${(e.date || '').replace(/"/g, '""')}"`,
      `"${(e.time || '').replace(/"/g, '""')}"`,
      `"${(e.location || '').replace(/"/g, '""')}"`,
      `"${(e.venue || '').replace(/"/g, '""')}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`,
      `"${(e.image || '').replace(/"/g, '""')}"`,
      `"${tags.join(', ')}"`,
      `"${(e.link || '').replace(/"/g, '""')}"`,
      `"${highlights.join(', ')}"`,
      `"${e.is_upcoming ? 'true' : 'false'}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  Swal.fire('Exported!', `${filename}.csv downloaded.`, 'success');
};

export default function DashboardEvents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '', date: '', time: '', location: '', venue: '',
    description: '', image: '', tags: '', link: '',
    highlights: '', is_upcoming: true
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await getEvents();
      
      // Process the data to ensure tags and highlights are arrays
      const processedEvents = (data || []).map(event => ({
        ...event,
        tags: typeof event.tags === 'string' 
          ? event.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : (event.tags || []),
        highlights: typeof event.highlights === 'string'
          ? event.highlights.split(',').map(h => h.trim()).filter(Boolean)
          : (event.highlights || [])
      }));
      
      setEvents(processedEvents);
    } catch (err) {
      Swal.fire('Error', 'Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(e => e.is_upcoming);
  const pastEvents = events.filter(e => !e.is_upcoming);

  const filteredUpcoming = upcomingEvents.filter(e =>
    (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPast = pastEvents.filter(e =>
    (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (event = null) => {
    setEditingEvent(event);
    
    // Helper function to safely extract array data for the form
    const getArrayData = (data, fieldName) => {
      if (!data || !data[fieldName]) return '';
      
      if (Array.isArray(data[fieldName])) {
        return data[fieldName].join(', ');
      }
      
      if (typeof data[fieldName] === 'string') {
        return data[fieldName];
      }
      
      return '';
    };
    
    setFormData(event ? {
      title: event.title || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      venue: event.venue || '',
      description: event.description || '',
      image: event.image || '',
      tags: getArrayData(event, 'tags'),
      link: event.link || '',
      highlights: getArrayData(event, 'highlights'),
      is_upcoming: event.is_upcoming ?? true
    } : {
      title: '', date: '', time: '', location: '', venue: '',
      description: '', image: '', tags: '', link: '',
      highlights: '', is_upcoming: true
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      highlights: formData.highlights.split(',').map(h => h.trim()).filter(Boolean),
    };

    try {
      if (editingEvent) {
        const { data: updated } = await updateEvent(
          editingEvent.id,
          payload,
          editingEvent.year
        );
        
        // Update the event in state with processed tags/highlights
        const processedUpdated = {
          ...updated,
          tags: typeof updated.tags === 'string' 
            ? updated.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : (updated.tags || []),
          highlights: typeof updated.highlights === 'string'
            ? updated.highlights.split(',').map(h => h.trim()).filter(Boolean)
            : (updated.highlights || [])
        };
        
        setEvents(prev => prev.map(e => e.id === editingEvent.id ? processedUpdated : e));
        Swal.fire('Success', 'Event updated successfully', 'success');
      } else {
        const { data: created } = await createEvent(payload);
        
        // Process the created event
        const processedCreated = {
          ...created,
          tags: typeof created.tags === 'string' 
            ? created.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : (created.tags || []),
          highlights: typeof created.highlights === 'string'
            ? created.highlights.split(',').map(h => h.trim()).filter(Boolean)
            : (created.highlights || [])
        };
        
        setEvents(prev => [...prev, processedCreated]);
        Swal.fire('Success', 'Event created successfully', 'success');
      }
      setShowModal(false);
    } catch (err) {
      let msg = 'Failed to save event';
      if (err.response?.status === 403) {
        msg = 'Not allowed to modify past year content';
      } else if (err.response?.status === 404) {
        msg = 'Event not found or inaccessible';
      }
      Swal.fire('Error', msg, 'error');
    }
  };

  const handleDelete = async (event) => {
    const result = await Swal.fire({
      title: 'Delete Event?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteEvent(event.id, event.year);
      setEvents(prev => prev.filter(e => e.id !== event.id));
      Swal.fire('Deleted', 'Event has been removed', 'success');
    } catch (err) {
      let msg = 'Failed to delete event';
      if (err.response?.status === 403) {
        msg = 'Cannot delete past year content';
      } else if (err.response?.status === 404) {
        msg = 'Event not found or inaccessible';
      }
      Swal.fire('Error', msg, 'error');
    }
  };

const handleImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Reset file input
  e.target.value = '';

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      console.log('Parsed CSV data:', results.data); // Debug log
      
      if (results.data.length === 0) {
        Swal.fire('Empty File', 'CSV file has no data.', 'info');
        return;
      }

      try {
        let count = 0;
        let errors = [];
        
        for (const [index, row] of results.data.entries()) {
          try {
            if (!row.Title || !row.Date) {
              errors.push(`Row ${index + 1}: Missing required fields (Title and Date are required)`);
              continue;
            }

            const payload = {
              title: row.Title?.trim(),
              date: row.Date?.trim(),
              time: row.Time?.trim() || '',
              location: row.Location?.trim() || '',
              venue: row.Venue?.trim() || '',
              description: row.Description?.trim() || '',
              image: row.Image?.trim() || '',
              tags: row.Tags ? row.Tags.split(',').map(t => t.trim()).filter(Boolean) : [],
              link: row.Link?.trim() || '',
              highlights: row.Highlights ? row.Highlights.split(',').map(h => h.trim()).filter(Boolean) : [],
              is_upcoming: row['Is Upcoming'] ? row['Is Upcoming'].toLowerCase() === 'true' : true
            };

            console.log('Sending payload:', payload); // Debug log
            
            await createEvent(payload);
            count++;
            
          } catch (rowError) {
            const rowNum = index + 1;
            const errorMsg = rowError.response?.data?.message || rowError.message || 'Unknown error';
            errors.push(`Row ${rowNum} (${row.Title || 'No title'}): ${errorMsg}`);
            console.error(`Error in row ${rowNum}:`, rowError);
          }
        }

        // Refresh events after import
        await fetchEvents();

        if (errors.length > 0) {
          const errorMessage = errors.length === results.data.length 
            ? 'All rows failed to import.'
            : `Imported ${count} of ${results.data.length} events.`;
          
          const errorDetails = errors.slice(0, 5).join('<br>'); // Show first 5 errors
          const moreErrors = errors.length > 5 ? `<br><br>... and ${errors.length - 5} more errors` : '';
          
          Swal.fire({
            title: 'Partial Import',
            html: `${errorMessage}<br><br>${errorDetails}${moreErrors}`,
            icon: errors.length === results.data.length ? 'error' : 'warning',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire('Success!', `${count} events imported successfully.`, 'success');
        }
      } catch (err) {
        console.error('Import error:', err);
        Swal.fire('Import Failed', 'Failed to import events. Please check the console for details.', 'error',err);
      }
    },
    error: (err) => {
      console.error('CSV Parse Error:', err);
      Swal.fire('Parse Error', 'Failed to parse CSV file. Please check the file format.', 'error',err);
    }
  });
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Events Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage upcoming & past events • {events.length} total
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => openModal()}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus size={18} /> New Event
            </button>

            <label className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-lg font-medium shadow-sm cursor-pointer flex items-center gap-2 transition-all">
              <Upload size={18} /> Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={() => exportToCSV(events, 'all_events')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-lg font-medium shadow-sm flex items-center gap-2 transition-all"
            >
              <Download size={18} /> Export All
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search events by title or description..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Upcoming Events */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              Upcoming Events ({filteredUpcoming.length})
            </h2>
            {filteredUpcoming.length > 0 && (
              <button
                onClick={() => exportToCSV(filteredUpcoming, 'upcoming_events')}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-2"
              >
                <Download size={16} /> Export
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredUpcoming.length === 0 ? (
                <p className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                  No upcoming events found
                </p>
              ) : (
                filteredUpcoming.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col border border-gray-200 dark:border-slate-700"
                  >
                    <div className={`${getEventColor(true)} p-6 text-white flex items-center gap-4`}>
                      {getEventIcon(true)}
                      <div>
                        <h3 className="font-bold text-xl">{event.title}</h3>
                        <p className="text-sm opacity-90 mt-1">
                          {event.date} • {event.time}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 flex-grow">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-5">
                        {event.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {event.location}
                          {event.venue && ` • ${event.venue}`}
                        </div>
                        {event.link && (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <LinkIcon size={16} />
                            Registration Link
                          </a>
                        )}
                        {event.image && (
                          <div className="flex items-center gap-2">
                            <ImageIcon size={16} />
                            Image attached
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 border-t border-gray-200 dark:border-slate-700 flex gap-3 bg-gray-50 dark:bg-slate-900/50">
                      <button
                        onClick={() => openModal(event)}
                        className="flex-1 py-2.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit3 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="flex-1 py-2.5 bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash size={16} /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Past Events */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <FileText className="w-6 h-6 text-gray-600" />
              Past Events ({filteredPast.length})
            </h2>
            {filteredPast.length > 0 && (
              <button
                onClick={() => exportToCSV(filteredPast, 'past_events')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Download size={16} /> Export
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPast.length === 0 ? (
                <p className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                  No past events found
                </p>
              ) : (
                filteredPast.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col border border-gray-200 dark:border-slate-700"
                  >
                    <div className={`${getEventColor(false)} p-6 text-white flex items-center gap-4`}>
                      {getEventIcon(false)}
                      <div>
                        <h3 className="font-bold text-xl">{event.title}</h3>
                        <p className="text-sm opacity-90 mt-1">
                          {event.date} • {event.time}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 flex-grow">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-5">
                        {event.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {event.location}
                          {event.venue && ` • ${event.venue}`}
                        </div>
                        {event.link && (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <LinkIcon size={16} />
                            View details
                          </a>
                        )}
                        {event.highlights.length > 0 && (
                          <div className="mt-4">
                            <p className="font-medium mb-2">Highlights:</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {event.highlights.map((h, i) => (
                                <li key={i}>{h}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 border-t border-gray-200 dark:border-slate-700 flex gap-3 bg-gray-50 dark:bg-slate-900/50">
                      <button
                        onClick={() => openModal(event)}
                        className="flex-1 py-2.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit3 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="flex-1 py-2.5 bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash size={16} /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="Event Title"
                        required
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Time
                      </label>
                      <input
                        type="text"
                        value={formData.time}
                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="10:00 AM – 4:00 PM"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="Dhaka, Bangladesh"
                      />
                    </div>

                    {/* Venue */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={e => setFormData({ ...formData, venue: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="International Convention City Bashundhara (ICCB)"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[120px]"
                        placeholder="Detailed description of the event..."
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="technology, AI, conference, workshop"
                      />
                    </div>

                    {/* Link */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Registration / Info Link
                      </label>
                      <input
                        type="url"
                        value={formData.link}
                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Highlights (for past events) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Highlights (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.highlights}
                        onChange={e => setFormData({ ...formData, highlights: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="500+ attendees, Keynote by Dr. XYZ, ..."
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Status
                      </label>
                      <select
                        value={formData.is_upcoming}
                        onChange={e => setFormData({ ...formData, is_upcoming: e.target.value === 'true' })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      >
                        <option value={true}>Upcoming</option>
                        <option value={false}>Past</option>
                      </select>
                    </div>

                    {/* Image */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="https://example.com/images/event.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex gap-4 bg-gray-50 dark:bg-slate-900/50 sticky bottom-0">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}